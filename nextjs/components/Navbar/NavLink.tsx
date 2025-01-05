"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href }: { href: string }) {
  const pathname = usePathname();
  return (
    <Link
      className={`${pathname === `/${href}` && "text-blue-600"}`}
      color="foreground"
      href={href}
    >
      {href}
    </Link>
  );
}
