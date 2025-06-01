import LocationTable from "@/app/Home/LocationTable";
import DynamicMap from "@/components/Map/DynamicMap";
import { LocationProvider } from "@/context/locationContext";
import { createClient } from "@clickhouse/client-web";
import CityPopupFront from "./CityPopup/CityPopupFront";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface locationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  bio: string;
  imgPath: string;
}

export async function handleRetrieveRecords() {
  "use server";

  const client = createClient({
    url: process.env.CLICKHOUSE_HOST ?? "http://localhost:8123",
    username: process.env.CLICKHOUSE_USER ?? "user",
    password: process.env.CLICKHOUSE_PASSWORD ?? "password",
  });

  const rows = await client.query({
    query: "select * from worldMap_cityLocation final;",
    format: "JSONEachRow",
  });

  const data = await rows.json();
  return data as locationData[];
}

export async function handleRetrieveObjects(path: string) {
  "use server";

  const client = new S3Client({
    endpoint: "http://localhost:9000",
    region: "us-east-1",
    credentials: {
      accessKeyId: "admin",
      secretAccessKey: "password",
    },
    forcePathStyle: true,
  });
  const getCmd = new GetObjectCommand({
    Bucket: "worldmap",
    Key: path,
  });
  const url = await getSignedUrl(client, getCmd, {
    expiresIn: 60 * 5,
  });
  return url;
}

export default async function Page() {
  async function handleRetrieveCities() {
    "use server";

    const data = await handleRetrieveRecords();
    const mapped = data.map(async (d) => {
      const url = await handleRetrieveObjects(d.imgPath);
      return { ...d, imgPath: url };
    });
    const fullyResolved: locationData[] = await Promise.all(mapped);
    return fullyResolved;
  }

  return (
    <div className="p-4 gap-4">
      <LocationProvider>
        <DynamicMap>
          <LocationTable handleRetrieveCitiesF={handleRetrieveCities} />
        </DynamicMap>
        <CityPopupFront />
      </LocationProvider>
    </div>
  );
}
