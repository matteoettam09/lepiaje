"use client";

import { useState } from "react";

interface ColorSwatchProps {
    name: string;
    hex: string;
    className?: string;
}

export function ColorSwatch({ name, hex, className }: ColorSwatchProps) {
    const [copied, setCopied] = useState(false);

    async function copyHex() {
        await navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <button
            type="button"
            onClick={copyHex}
            className="group flex flex-col gap-3 text-left transition-opacity hover:opacity-90"
        >
            <div
                className={`h-24 w-full rounded-md border border-brand-sand shadow-soft ${className ?? ""}`}
                style={{ backgroundColor: hex }}
            />
            <div>
                <p className="font-display text-lg text-brand-ink">{name}</p>
                <p className="font-sans text-sm text-brand-muted">{hex}</p>
                <p className="mt-1 font-sans text-xs text-brand-terracotta opacity-0 transition-opacity group-hover:opacity-100">
                    {copied ? "Copied!" : "Click to copy"}
                </p>
            </div>
        </button>
    );
}
