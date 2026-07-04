import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth/session";

const usernameENV = process.env.USERNAME!;
const passwordENV = process.env.USER_PASSWORD!;

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    if (username === usernameENV && password === passwordENV) {
        const token = await createSessionToken(username);
        const response = NextResponse.json({ success: true });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
        });

        return response;
    }

    return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
    );
}
