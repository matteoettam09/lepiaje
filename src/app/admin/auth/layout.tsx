import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth/session";

export default async function AdminAuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/admin");
    }

    const { valid } = await verifySessionToken(token);
    if (!valid) {
        redirect("/admin");
    }

    return <>{children}</>;
}
