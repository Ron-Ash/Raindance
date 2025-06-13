"use client";

import { ReactNode } from "react";

export default function SocialPostCardBorder({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border-3 border-stone-700 w-[500px] h-fit p-1 backdrop-blur-xl">
      {children}
    </div>
  );
}
