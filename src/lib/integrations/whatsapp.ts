export function normalizeWhatsAppPhone(phone: string): string {
    return phone.replace(/\D/g, "");
}

export function buildWhatsAppUrl(
    phone: string,
    message: string
): string {
    const normalizedPhone = normalizeWhatsAppPhone(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

export function getWhatsAppPhoneFromEnv(): string | null {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!phone?.trim()) return null;
    return phone.trim();
}
