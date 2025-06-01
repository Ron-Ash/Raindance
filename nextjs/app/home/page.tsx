import LocationTable from "@/app/Home/LocationTable";
import DynamicMap from "@/components/Map/DynamicMap";
import { LocationProvider } from "@/context/locationContext";
import CityPopupFront from "./CityPopup/CityPopupFront";
import { minIoGetObjectUrl } from "@/components/MinIOInterface";
import { clickhouseGetRecords } from "@/components/ClickhouseInterface";

interface locationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  bio: string;
  imgPath: string;
}

export default async function Page() {
  async function handleRetrieveCities() {
    "use server";

    const data = (await clickhouseGetRecords(
      "select * from worldMap_cityLocation final;"
    )) as locationData[];
    const mapped = data.map(async (d) => {
      const url = await minIoGetObjectUrl("worldmap", d.imgPath);
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
