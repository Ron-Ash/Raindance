"use client";

import Popup from "@/components/Popup";
import { useLocation } from "@/context/locationContext";
import { useEffect, useState } from "react";

export default function CityPopupFront() {
  const [open, setOpen] = useState(false);
  const { pickedLocation } = useLocation();

  useEffect(() => {
    if (pickedLocation != undefined) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pickedLocation]);

  return (
    <Popup active={open}>
      <>
        <div className="font-extrabold text-5xl"> Brisbane</div>
        <p>
          Brisbane, capital of Queensland, is a large city on the Brisbane
          River. Clustered in its South Bank cultural precinct are the
          Queensland Museum and Sciencentre, with noted interactive exhibitions.
          Another South Bank cultural institution is Queensland Gallery of
          Modern Art, among Australia's major contemporary art museums. Looming
          over the city is Mt. Coot-tha, site of Brisbane Botanic Gardens.
        </p>
        <img src={"/brisbane.jpg"} alt={"image"} className="rounded-xl" />
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <div className="grid grid-cols-2 p-2 gap-4">
          <button className="border-2 rounded-lg p-2">Cancel</button>
          <button className="border-2 rounded-lg p-2">Explore Weather</button>
        </div>
      </>
    </Popup>
  );
}
