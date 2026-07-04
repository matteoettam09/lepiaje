export function getMapboxAccessToken(): string | null {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token?.trim()) return null;
    return token.trim();
}

export function requireMapboxAccessToken(): string {
    const token = getMapboxAccessToken();
    if (!token) {
        throw new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not configured");
    }
    return token;
}
