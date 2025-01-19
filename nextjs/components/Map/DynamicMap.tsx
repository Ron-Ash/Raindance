"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

export default function DynamicMap({ children }: { children: ReactNode }) {
  return <Map>{children}</Map>;
}
