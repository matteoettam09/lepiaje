import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";

export const fontDisplay = Cormorant_Garamond({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const fontBody = Source_Sans_3({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});
