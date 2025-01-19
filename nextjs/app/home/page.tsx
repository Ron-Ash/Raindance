import LocationTable from "@/components/LocationTable/LocationTable";
import DynamicMap from "@/components/Map/DynamicMap";
import { createClient } from "@clickhouse/client-web";

interface locationData {
  city: string;
  country: string;
  latitude: number;
  logitude: number;
}

export default async function Page() {
  async function handleRetrieveCities() {
    "use server";

    const client = createClient({
      url: process.env.CLICKHOUSE_HOST ?? "http://localhost:8123",
      username: process.env.CLICKHOUSE_USER ?? "user",
      password: process.env.CLICKHOUSE_PASSWORD ?? "password",
    });

    const rows = await client.query({
      query: "select * from location;",
      format: "JSONEachRow",
    });

    const data = await rows.json();
    console.log(data);
    return data as locationData[];
  }

  return (
    <div className="lg:grid grid-cols-4 p-4 gap-4">
      <LocationTable handleRetrieveCitiesF={handleRetrieveCities} />
      <div className="col-span-3 w-full h-[600px] rounded-xl overflow-hidden">
        <DynamicMap>
          <div />
        </DynamicMap>
      </div>
    </div>
  );
}
