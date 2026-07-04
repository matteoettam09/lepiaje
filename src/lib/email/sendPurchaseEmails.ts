import { getResendClient } from "@/lib/email/resendClient";
import { PurchaseType } from "@/types";

const emailFrom = process.env.NEXT_PUBLIC_SENDER_EMAIL || "delivered@resend.dev";
const adminEmail = process.env.ADMIN_EMAIL_ONE_RECEIVER || "";

export async function sendPurchaseNotification(
    purchases: PurchaseType[],
    clientEmail: string
): Promise<void> {
    const resend = getResendClient();
    if (!resend || !adminEmail) return;

    const itemsList = purchases
        .map(
            (p) =>
                `${p.amountOfProduct}x ${p.productName} — €${p.amountPaid.toFixed(2)}`
        )
        .join("\n");

    await resend.emails.send({
        from: emailFrom,
        to: [adminEmail],
        subject: `New farm shop order from ${clientEmail}`,
        text: `New purchase order:\n\nCustomer: ${clientEmail}\n\n${itemsList}`,
    });

    await resend.emails.send({
        from: emailFrom,
        to: [clientEmail],
        subject: "Your Le Piaje order confirmation",
        text: `Thank you for your order!\n\n${itemsList}\n\nWe will contact you about pickup arrangements.`,
    });
}
