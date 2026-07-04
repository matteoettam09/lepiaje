import { describe, it, expect, afterEach } from "vitest";
import {
    buildWhatsAppUrl,
    getWhatsAppPhoneFromEnv,
    normalizeWhatsAppPhone,
} from "@/lib/integrations/whatsapp";

describe("whatsapp integration", () => {
    const originalPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

    afterEach(() => {
        if (originalPhone === undefined) {
            delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
        } else {
            process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalPhone;
        }
    });

    it("normalizes phone numbers by stripping non-digits", () => {
        expect(normalizeWhatsAppPhone("+39 338 303 2673")).toBe("393383032673");
        expect(normalizeWhatsAppPhone("39-338-303-2673")).toBe("393383032673");
    });

    it("builds a wa.me URL with encoded message", () => {
        const url = buildWhatsAppUrl("+39 338 303 2673", "Hello, Le Piaje!");
        expect(url).toBe(
            "https://wa.me/393383032673?text=Hello%2C%20Le%20Piaje!"
        );
    });

    it("returns null when env phone is missing", () => {
        delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
        expect(getWhatsAppPhoneFromEnv()).toBeNull();
    });

    it("returns trimmed phone from env", () => {
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = " 393383032673 ";
        expect(getWhatsAppPhoneFromEnv()).toBe("393383032673");
    });
});
