export const brandColors = {
    gold: { DEFAULT: "#c39c41", dark: "#664906" },
    olive: "#57b481",
    cream: "#fdfdfd",
    charcoal: "#121212",
    ink: "#141418",
} as const;

export const brandGradients = {
    contactForm: "linear-gradient(to right, #121212, #664906)",
} as const;

export const brandFonts = {
    display: "Cormorant Garamond",
    body: "DM Sans",
} as const;

export type BrandColorName = keyof typeof brandColors;

export const brandColorEntries = [
    { name: "Gold", key: "gold", hex: brandColors.gold.DEFAULT },
    { name: "Gold Dark", key: "goldDark", hex: brandColors.gold.dark },
    { name: "Olive", key: "olive", hex: brandColors.olive },
    { name: "Cream", key: "cream", hex: brandColors.cream },
    { name: "Charcoal", key: "charcoal", hex: brandColors.charcoal },
    { name: "Ink", key: "ink", hex: brandColors.ink },
] as const;
