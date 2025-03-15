'use client'; // Ensure this is a client component

import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import Link from "next/link"; // Import Link from next/link
import ModeToggle from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Link href="/cart">
          <Button variant="ghost">
            <ShoppingCart /> Cart
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button>
            <UserIcon /> Sign In
          </Button>
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Link href="/cart">
              <Button variant="ghost">
                <ShoppingCart /> Cart
              </Button>
            </Link>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;