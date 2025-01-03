import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  const menuItems = ["home", "bets", "profile"];

  return (
    <Navbar shouldHideOnScroll className="p-2 justify-start">
      <NavbarBrand>
        <Image src="/favicon.png" width={50} height={50} alt="icon" />
        <p className="font-bold text-inherit">Raindance</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        {menuItems.map((path, index) => (
          <NavbarItem key={index}>
            <Link color="foreground" href={path}>
              {path}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
    </Navbar>
  );
}
