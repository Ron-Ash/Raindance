"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface locationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  bio: string;
  imgPath: string;
}

const LocationContext = createContext<{
  location: locationData[];
  setLocation: Dispatch<SetStateAction<locationData[]>>;
  pickedLocation: locationData | null;
  setPickedLocation: Dispatch<SetStateAction<locationData | null>>;
}>({
  location: [],
  setLocation: () => {},
  pickedLocation: null,
  setPickedLocation: () => {},
});

function LocationProvider({ children }: any) {
  const [location, setLocation] = useState<locationData[]>([]);

  const [pickedLocation, setPickedLocation] = useState<locationData | null>(
    null
  );

  return (
    <LocationContext.Provider
      value={{ location, setLocation, pickedLocation, setPickedLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

function useLocations() {
  const {
    location,
    setLocation,
  }: {
    location: locationData[];
    setLocation: Dispatch<SetStateAction<locationData[]>>;
  } = useContext(LocationContext);

  return { location, setLocation };
}

function useLocation() {
  const {
    pickedLocation,
    setPickedLocation,
  }: {
    pickedLocation: locationData | null;
    setPickedLocation: Dispatch<SetStateAction<locationData | null>>;
  } = useContext(LocationContext);

  return {
    pickedLocation,
    setPickedLocation,
  };
}

export { LocationProvider, useLocations, useLocation };
