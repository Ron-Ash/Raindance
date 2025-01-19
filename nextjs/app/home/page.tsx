import LocationTable from "@/components/LocationTable/LocationTable";
import DynamicMap from "@/components/Map/DynamicMap";
import { LocationProvider } from "@/context/locationContext";
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
    return data as locationData[];
  }

  return (
    <div className="p-4 gap-4">
      <LocationProvider>
        <DynamicMap>
          <LocationTable handleRetrieveCitiesF={handleRetrieveCities} />
        </DynamicMap>
      </LocationProvider>
    </div>
  );
}
