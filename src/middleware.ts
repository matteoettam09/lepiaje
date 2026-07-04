import { NextResponse, NextRequest } from "next/server";
import { COOKIE_NAME } from "@/i18n/config";
import { detectLocale } from "@/i18n/detect-locale";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function applyLocaleCookie(response: NextResponse, request: NextRequest) {
  if (request.cookies.get(COOKIE_NAME)?.value) {
    return;
  }

  const locale = detectLocale(
    request.headers.get("accept-language"),
    request.headers.get("x-vercel-ip-country") ?? undefined
  );

  response.cookies.set(COOKIE_NAME, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (pathname.startsWith("/admin/auth") && !token) {
    const redirect = NextResponse.redirect(new URL("/admin", request.url));
    applyLocaleCookie(redirect, request);
    return redirect;
  }

  const response = NextResponse.next();
  applyLocaleCookie(response, request);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
