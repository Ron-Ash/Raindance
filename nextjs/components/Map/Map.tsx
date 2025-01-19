"use client";

import { ReactNode, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon, LatLng, LatLngBounds, LeafletMouseEvent } from "leaflet";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useLocation, useLocations } from "@/context/locationContext";

export default function Map({ children }: { children: ReactNode }) {
  const [tileType, setTileType] = useState<string>("Satellite");

  return (
    <div className="relative w-full h-[85vh] rounded-xl overflow-hidden">
      <div className="absolute z-10 p-2">
        <Tabs
          selectedKey={tileType}
          onSelectionChange={(key) => setTileType(String(key))}
        >
          <Tab
            key="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            title="Satellite"
          />
          <Tab
            key="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            title="Simple"
          />
        </Tabs>
      </div>
      <MapContainer
        attributionControl={false}
        center={[0, 0]}
        className={"relative w-full h-full z-0"}
        maxBounds={
          new LatLngBounds(
            [-90, -180], // Southwest corner
            [90, 180] // Northeast corner
          )
        }
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        zoom={3}
        zoomControl={false}
      >
        <TileLayer
          className="relative z-0"
          keepBuffer={10}
          maxNativeZoom={18} // maximum zoom of tiles natively
          maxZoom={18} // maximum zoom of map, if higher than maxNativeZoom will stretch tiles
          minZoom={3}
          url={tileType}
        />
        <LocationMarkers />
      </MapContainer>
      {children}
    </div>
  );
}

function LocationMarkers() {
  const map = useMap();
  const { location } = useLocations();
  const { pickedLocation } = useLocation();

  useEffect(() => {
    if (pickedLocation != undefined) {
      map.flyTo(
        new LatLng(pickedLocation.latitude, pickedLocation.longitude),
        16
      );
    }
  }, [map, pickedLocation]);

  function HandleClick(e: LeafletMouseEvent) {
    map.flyTo(e.latlng, 16);
  }

  return (
    <>
      {location.map((city, index) => (
        <Marker
          key={index}
          eventHandlers={{
            dblclick(e) {
              HandleClick(e);
            },
          }}
          icon={icon({
            iconUrl: "marker.webp",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          })}
          position={[city.latitude, city.longitude]}
        >
          <Popup>
            {city.city}, {city.country}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
