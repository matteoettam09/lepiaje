import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/auth/session";

describe("session", () => {
    it("signs and verifies a session token round-trip", async () => {
        const token = await createSessionToken("admin");
        const result = await verifySessionToken(token);

        expect(result.valid).toBe(true);
        expect(result.username).toBe("admin");
    });

    it("rejects invalid tokens", async () => {
        const result = await verifySessionToken("not-a-valid-jwt");
        expect(result.valid).toBe(false);
        expect(result.username).toBeUndefined();
    });
});
