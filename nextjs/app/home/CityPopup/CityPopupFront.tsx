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
        <img src={"/brisbane.jpg"} alt={"image"} className="rounded-xl" />
        <p>
          Brisbane, capital of Queensland, is a large city on the Brisbane
          River. Clustered in its South Bank cultural precinct are the
          Queensland Museum and Sciencentre, with noted interactive exhibitions.
          Another South Bank cultural institution is Queensland Gallery of
          Modern Art, among Australia's major contemporary art museums. Looming
          over the city is Mt. Coot-tha, site of Brisbane Botanic Gardens.
        </p>
        <button
          className="absolute top-1 right-1"
          onClick={() => setOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <button className="border-2 rounded-lg p-2">Explore Weather</button>
      </>
    </Popup>
  );
}
