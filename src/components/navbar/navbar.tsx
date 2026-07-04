import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from "../logo/logo";
import { Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import Link from "next/link";
import { NavLinks } from "./nav_links";

const mobileLinkClass =
  "text-center text-brand-ink justify-center flex w-full items-center py-2 text-lg font-semibold hover:text-brand-terracotta transition-colors";

const desktopLinkClass =
  "whitespace-nowrap text-brand-ink group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:text-brand-terracotta transition-colors focus:outline-none";

export function Navbar() {
  return (
    <header className="top-0 fixed z-50 flex h-24 w-full shrink-0 items-center border-b border-brand-sand bg-brand-linen/95 px-4 backdrop-blur-sm md:px-6">
      <Sheet>
        <SheetTitle>
          <Link href={"/"} prefetch={false}>
            <Logo width="w-[5em]" height="h-[5em]" blur="blur-lg" />
          </Link>
        </SheetTitle>
        <SheetTrigger asChild>
          <div className="text-brand-ink flex w-full items-center justify-end lg:justify-end md:justify-end sm:justify-end">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden flex border-brand-sand m-1"
            >
              <MenuIcon />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent
          className="border-brand-sand bg-brand-linen"
          side="right"
        >
          <div className="text-brand-ink place-content-center grid gap-2 py-6">
            <NavLinks
              className={mobileLinkClass}
              contactClassName={`${mobileLinkClass} mt-2 shrink-0 whitespace-nowrap rounded-md bg-brand-terracotta px-6 text-brand-linen hover:bg-brand-terracotta-dark hover:text-brand-linen`}
            />
            <div className="flex justify-center items-center my-16 space-x-6">
              <Link href="mailto:giulianaclementini.ad@gmail.com" className="text-brand-muted hover:text-brand-terracotta transition-colors">
                <Mail size={21} />
                <span className="sr-only">Email</span>
              </Link>
              <Link href="tel:+393383032673" className="text-brand-muted hover:text-brand-terracotta transition-colors">
                <Phone size={20} />
                <span className="sr-only">Phone</span>
              </Link>
              <Link href="https://instagram.com/lepiaje" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-terracotta transition-colors">
                <FaInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com/lepiaje" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-terracotta transition-colors">
                <FaFacebookF size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
            <Logo width="w-[6em]" height="h-[6em]" blur="blur-lg" />
          </div>
        </SheetContent>
      </Sheet>

      <nav className="ml-auto hidden shrink-0 items-center gap-3 lg:flex xl:gap-4">
        <NavLinks className={desktopLinkClass} />
      </nav>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
