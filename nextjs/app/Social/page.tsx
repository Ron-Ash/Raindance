import SocialFeed from "./SocialFeed";
import SocialPostForm from "@/components/SocialPostForm";
import { auth } from "@/auth";
import { clickhouseGetRecords } from "@/components/ClickhouseInterface";
import SocialPostCard from "@/components/SocialPostCard/SocialPostCard";

interface postData {
  author: string;
  eventTime: string;
  message: string;
  attachmentPath: string;
  reply_author: string;
  reply_eventTime: string;
}

export default async function Page() {
  const session = await auth();
  async function handleRetrieveReplies(author: string, eventTime: string) {
    "use server";

    const data = (await clickhouseGetRecords(
      `select * from socialNetwork_posts where author='${author}' and eventTime='${eventTime}';`
    )) as postData[];
    // const mapped = data.map(async (d) => {
    //   const url = await minIoGetObjectUrl("socialNetwork", d.imgPath);
    //   return { ...d, imgPath: url };
    // });
    // const fullyResolved: postData[] = await Promise.all(mapped);
    // return fullyResolved;
    return data;
  }
  return (
    <div className="gap-4 relative w-full h-[85svh] overflow-hidden grid grid-cols-2">
      {/* <div className="p-1 bg-opacity-70 sticky top-0 flex items-center gap-4 h-[10vh] border-b-2 border-blue-500">
        <Image
          className="rounded-full cursor-pointer w-[50px] h-[50px]"
          src="https://i.pravatar.cc/"
          alt="profileImage"
          width={100}
          height={100}
        />
        <b>hell world</b>
      </div>
      <Messages topic={"test-topic"} />
      <TextBox topic={"test-topic"} /> */}
      {/* <SocialFeed
        topic={"socialNetwork_postStream"}
        user={"anonymous"}
        handleRetrieveRepliesF={handleRetrieveReplies}
      />
      <div className="justify-self-end self-end">
        <SocialPostForm profilePic={session?.user?.image ?? null} />
      </div> */}
      <SocialPostCard
        profilePic={"/cityPhotos/brisbane.jpg"}
        message={
          "Rome’s history spans over two and a half millennia, from its legendary founding by Romulus in 753 BCE to the fall of Constantinople in 1453 CE. Beginning as a small settlement on the Tiber River, it grew into a republic ruled by elected senators. Through military conquest and political innovation, Rome built an empire that stretched from Britain to Mesopotamia. Cultural achievements in law, architecture, and literature influenced civilization for centuries. Internal strife, economic pressures, and barbarian invasions eroded its power, leading to the Western Empire’s collapse in 476 CE. Meanwhile, the Eastern Roman Empire persisted as Byzantium until its eventual final demise."
        }
        attachmentPath={"/cityPhotos/brisbane.jpg"}
        eventTime={"2025-06-08"}
        author={"memescollect"}
        reply_author={"how_are_you"}
        reply_eventTime={`2025-06-02`}
        handleRetrieveRepliesFF={handleRetrieveReplies}
      />
    </div>
  );
}
