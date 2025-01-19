"use client";
import { useLocation, useLocations } from "@/context/locationContext";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useEffect, useState } from "react";

interface locationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export default function LocationTable({
  handleRetrieveCitiesF,
}: {
  handleRetrieveCitiesF: () => Promise<locationData[]>;
}) {
  const [loading, setLoading] = useState(true);
  const { location, setLocation } = useLocations();
  const { setPickedLocation } = useLocation();

  useEffect(() => {
    async function handleRetrieveCities() {
      const data = await handleRetrieveCitiesF();
      setLocation(data);
      setLoading(false);
    }
    setLoading(true);
    handleRetrieveCities();
  }, []);

  function handleSelection(keys: Set<string>) {
    setPickedLocation(
      location[
        (keys.entries().next().value?.[0] ?? "null") as unknown as number
      ]
    );
  }

  return (
    <div className="absolute bottom-2 left-2 z-10 p-2 backdrop-blur-md rounded-lg max-h-[300px] max-w-[400px] overflow-auto">
      <Table
        isHeaderSticky
        removeWrapper
        aria-label="Example static collection table"
        color="primary"
        selectionMode="single"
        onSelectionChange={(keys) => handleSelection(keys as Set<string>)}
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody className="text-white">
          {!loading
            ? location?.map((city, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer hover:text-black "
                >
                  <TableCell>{city?.city ?? ""}</TableCell>
                  <TableCell>{city?.country ?? ""}</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              ))
            : []}
        </TableBody>
      </Table>
    </div>
  );
}
