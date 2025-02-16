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

export function Navbar() {
  return (
    <header className=" top-0 fixed z-50 bg-lepiajeBrown flex h-24 w-full bg-opacity-0 backdrop-filter backdrop-blur-md shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTitle>
          <Link href={"/"} prefetch={false}>
            <Logo width="w-[5em]" height="h-[5em]" blur="blur-lg" />
          </Link>
        </SheetTitle>
        <SheetTrigger asChild>
          <div className="  text-[#fff] flex w-full items-center justify-end lg:justify-end md:justify-end sm:justify-end">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden flex bg-[rgba(0,0,0,0.3)] m-1"
            >
              <MenuIcon />
              <span className="sr-only text-white">Toggle navigation menu</span>
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent
          className="bg-opacity-10 bg-[#121212] backdrop-filter backdrop-blur-md "
          side="right"
        >
          {/* Mobile devices */}

          <div className="text-[#ffff] place-content-center  grid gap-2 py-6">
            <Link
              href="/property/villa-perlata"
              className="text-center text-[#ffff] justify-center flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              La Villa Perlata
            </Link>
            <Link
              href="/property/centesimo-chilometro"
              className="text-center text-[#ffff] justify-center flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Al Centesimo Chilometro
            </Link>
            <Link
              href="/about"
              className=" text-center text-[#ffff] justify-center flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              About Us
            </Link>
            <Link
              href="/reach-us"
              className=" text-[#ffff] justify-center flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              How to reach Us
            </Link>
            <div className="flex justify-center items-center my-16 space-x-6">
              <Link
                href="mailto:contact@lepiaje.com"
                className="hover:text-gray-900 transition-colors"
              >
                <Mail color="#f1f1f1" size={21} />
                <span className="sr-only">Email</span>
              </Link>
              <Link
                href="tel:+1234567890"
                className="hover:text-gray-900 transition-colors"
              >
                <Phone color="#f1f1f1" size={20} />
                <span className="sr-only">Phone</span>
              </Link>
              <Link
                href="https://instagram.com/lepiaje"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                <FaInstagram color="#fd1d1d" size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://facebook.com/lepiaje"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                <FaFacebookF color="#1877F2" size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
            <Logo width="w-[6em]" height="h-[6em]" blur="blur-lg" />
          </div>
        </SheetContent>
      </Sheet>

      <nav className="ml-auto hidden lg:flex gap-6">
        {/* Desktop and tablets */}

        <Link
          href="/property/villa-perlata"
          className="whitespace-nowrap text-lepiajeWhite group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium  hover:bg-lepiajeBrown hover:scale-105 duration-150 transition-all hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          La Villa Perlata
        </Link>
        <Link
          href="/property/centesimo-chilometro"
          className="whitespace-nowrap text-lepiajeWhite group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium  hover:bg-lepiajeBrown hover:scale-105 duration-150 ease-linear hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          Al Centesimo Chilometro
        </Link>
        <Link
          href="/about"
          className="whitespace-nowrap text-lepiajeWhite group inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium  hover:bg-lepiajeBrown hover:scale-105 duration-150 ease-linear hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          About Us
        </Link>
        <Link
          href="/reach-us"
          className="whitespace-nowrap text-lepiajeWhite group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium  hover:bg-lepiajeBrown hover:scale-105 duration-150 ease-linear hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          prefetch={false}
        >
          How to reach Us
        </Link>
      </nav>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#fff"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
