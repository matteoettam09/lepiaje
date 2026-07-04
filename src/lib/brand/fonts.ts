import { Cormorant_Garamond, DM_Sans } from "next/font/google";

export const fontDisplay = Cormorant_Garamond({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const fontBody = DM_Sans({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});
