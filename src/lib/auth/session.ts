import { SignJWT, jwtVerify } from "jose";

function getSecret() {
    const secret =
        process.env.AUTH_SECRET ||
        process.env.USER_PASSWORD ||
        "lepiaje-dev-secret-change-in-production";
    return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
    return new SignJWT({ username, role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .setIssuedAt()
        .sign(getSecret());
}

export async function verifySessionToken(
    token: string
): Promise<{ valid: boolean; username?: string }> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return { valid: true, username: payload.username as string };
    } catch {
        return { valid: false };
    }
}
