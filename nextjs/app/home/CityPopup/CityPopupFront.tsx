"use client";

import Popup from "@/components/Popup";
import { useLocation } from "@/context/locationContext";
import Image from "next/image";
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
      {pickedLocation && (
        <div className="relative flex flex-col h-full p-1">
          <div className="font-extrabold text-5xl pb-4">
            {pickedLocation?.city}
          </div>
          <div className="relative rounded-xl h-[200px] flex items-center justify-center overflow-hidden">
            <Image
              alt={"image"}
              priority={true}
              src={pickedLocation?.imgPath ?? ""}
              fill
            />
          </div>
          <p className="mt-2 flex-1 overflow-auto text-base font-bold">
            {pickedLocation?.bio}
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
          <button className="mt-2 h-[50px] w-full border-2 rounded-l-2xl rounded-r-md bg-blue-500 bg-opacity-0 hover:bg-opacity-100 ease-in-out duration-200 hover:border-blue-500">
            Explore Weather
          </button>
        </div>
      )}
    </Popup>
  );
}
