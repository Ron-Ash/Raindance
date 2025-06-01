from confluent_kafka import Consumer, KafkaError, KafkaException
from transformers import AutoTokenizer, AutoModel, CLIPModel
from torchvision import transforms
import torch.nn.functional as F
import clickhouse_connect
from PIL import Image
import torch
import sys
import json
import os

class TextEmbedder:
    def __init__(self):
        modelName = 'sentence-transformers/all-MiniLM-L12-v2'
        self.tokenizer = AutoTokenizer.from_pretrained(modelName)
        self.model = AutoModel.from_pretrained(modelName)
    
    def mean_pooling(self, modelOutput, attentionMask):
        tockenEmbeddings = modelOutput[0] #First element of modelOutput contains all token embeddings
        inputMaskExpanded = attentionMask.unsqueeze(-1).expand(tockenEmbeddings.size()).float()
        return torch.sum(tockenEmbeddings * inputMaskExpanded, 1) / torch.clamp(inputMaskExpanded.sum(1), min=1e-9)

    def run(self, sentences: list[str]):
        encodedInput = self.tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')
        # Compute token embeddings
        with torch.no_grad():
            modelOutput = self.model(**encodedInput)
        # Perform pooling
        sentenceEmbeddings = self.mean_pooling(modelOutput, encodedInput['attention_mask'])
        # Normalize embeddings
        sentenceEmbeddings = F.normalize(sentenceEmbeddings, p=2, dim=1)
        return sentenceEmbeddings

class ImageEmbedder:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        modelName = "openai/clip-vit-base-patch32"
        self.model = CLIPModel.from_pretrained(modelName).to(self.device)
        self.model.eval()

        # 2. Manually recreate CLIPProcessor’s image transforms
        #    CLIP expects: resize to 224×224 (bicubic) → center‐crop 224 → ToTensor() → Normalize(...)
        self.preprocess = transforms.Compose([
            transforms.Resize((224, 224), interpolation=Image.BICUBIC),
            transforms.CenterCrop(224),
            transforms.ToTensor(),  # scales to [0,1] and shape [3,224,224]
            transforms.Normalize(
                mean=(0.48145466, 0.4578275, 0.40821073),
                std=(0.26862954, 0.26130258, 0.27577711)
            ),
        ])

    def run(self, imagePath: str):
        # a) Load image and convert to RGB
        pil_img = Image.open(imagePath).convert("RGB")
        # b) Apply CLIP’s resize/crop/normalize
        pixelValues = self.preprocess(pil_img).unsqueeze(0).to(self.device)  # shape [1, 3, 224, 224]
        # c) Extract CLIP features
        with torch.no_grad():
            imageFeatures = self.model.get_image_features(pixel_values=pixelValues)  # [1,512]
        return imageFeatures

def feed_Embedding_pipeline_update(consumer: Consumer, client, textEmbedder: TextEmbedder, imageEmbedder: ImageEmbedder):
    try:
        consumer.subscribe(['socialNetwork_postStream'])
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None: continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    sys.stderr.write(f'{msg.topic()} {msg.partition()} reached end at offset [{msg.offset()}]')
                raise KafkaException(msg.error())
            print("= START =========================")

            print(msg.key().decode(), msg.value().decode(), msg.topic())
            value = json.loads(msg.value().decode())
            author = msg.key().decode()
            message = value.get("message", None).replace("'", "\\'")
            attachmentPath = value.get("attachmentPath", None)
            if any([message, attachmentPath, author]) is None:
                KafkaException("message format not correct")
            query = f"INSERT INTO socialNetwork_posts (`author`, `message`, `attachmentPath`, `eventTime`, `messageEmbedding`, `attachmentEmbedding`) VALUES ('{author}','{message}','{attachmentPath}', NOW(), {textEmbedder.run([message]).tolist()[0]}, [])"
            client.query(query)
            print("= END ===========================")
    finally:
        consumer.close()

if __name__ == "__main__":
    client = clickhouse_connect.get_client(host=os.getenv("CLICKHOUSE_HOST", 'localhost'), port=8123, username=os.getenv("CLICKHOUSE_USER", 'user'), password=os.getenv("CLICKHOUSE_PASSWORD",'password'))
    consumer = Consumer({'bootstrap.servers': 'localhost:29092,localhost:39092,localhost:49092','group.id': 'feedCuration'})
    textEmbedder = TextEmbedder()
    imageEmbedder = ImageEmbedder()
    feed_Embedding_pipeline_update(consumer, client, textEmbedder, imageEmbedder)