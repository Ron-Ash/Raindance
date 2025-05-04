import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import Image from "next/image";
import NavLink from "./NavLink";
import Link from "next/link";

export default function Nav() {
  const menuItems = ["Home", "Analytics", "Weather", "Social"];

  return (
    <Navbar shouldHideOnScroll className="flex p-1 justify-start gap-4">
      <Link href="/" className="hover:opacity-60">
        <Image
          src="/favicon.png"
          width={50}
          height={50}
          alt="icon"
          priority={true}
        />
      </Link>
      <p className="font-bold text-inherit">Raindance</p>
      <div className="border" />
      <NavbarContent className="flex gap-4">
        {menuItems.map((path, index) => (
          <NavbarItem key={index} className="hover:opacity-60">
            <NavLink href={path} />
          </NavbarItem>
        ))}
      </NavbarContent>
    </Navbar>
  );
}
