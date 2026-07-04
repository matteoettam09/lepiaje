export const brandColors = {
    linen: "#FAF7F2",
    stone: "#EDE8E0",
    sand: "#D9D0C4",
    ink: "#2A2622",
    muted: "#6B635A",
    terracotta: { DEFAULT: "#B8654A", dark: "#8F4A32" },
} as const;

export const brandGradients = {
    contactForm: "linear-gradient(to right, #EDE8E0, #D9D0C4)",
} as const;

export const brandFonts = {
    display: "Cormorant Garamond",
    body: "Source Sans 3",
} as const;

export type BrandColorName = keyof typeof brandColors;

export const brandColorEntries = [
    { name: "Linen", key: "linen", hex: brandColors.linen },
    { name: "Stone", key: "stone", hex: brandColors.stone },
    { name: "Sand", key: "sand", hex: brandColors.sand },
    { name: "Ink", key: "ink", hex: brandColors.ink },
    { name: "Muted", key: "muted", hex: brandColors.muted },
    {
        name: "Terracotta",
        key: "terracotta",
        hex: brandColors.terracotta.DEFAULT,
    },
    {
        name: "Terracotta Dark",
        key: "terracottaDark",
        hex: brandColors.terracotta.dark,
    },
] as const;
