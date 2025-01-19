"use client";
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
  logitude: number;
}

export default function LocationTable({
  handleRetrieveCitiesF,
}: {
  handleRetrieveCitiesF: () => Promise<locationData[]>;
}) {
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<locationData[]>([]);

  function handleSelection(keys: Set<string>) {
    console.log(keys.entries().next().value?.[0]);
  }

  useEffect(() => {
    async function handleRetrieveCities() {
      const data = await handleRetrieveCitiesF();
      setCities(data);
      setLoading(false);
    }
    setLoading(true);
    handleRetrieveCities();
  }, []);

  return (
    <Table
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
      <TableBody>
        {!loading
          ? cities?.map((city, index) => (
              <TableRow key={index} className="cursor-pointer">
                <TableCell>{city?.city ?? ""}</TableCell>
                <TableCell>{city?.country ?? ""}</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            ))
          : []}
      </TableBody>
    </Table>
  );
}
