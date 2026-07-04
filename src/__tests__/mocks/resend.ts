import { vi } from "vitest";

export function createMockResend() {
    return {
        emails: {
            send: vi.fn().mockResolvedValue({ id: "email_test_123" }),
        },
    };
}
