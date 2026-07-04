import type { ComponentType, SVGProps } from "react";
import ES from "country-flag-icons/react/3x2/ES";
import BG from "country-flag-icons/react/3x2/BG";
import GE from "country-flag-icons/react/3x2/GE";
import NO from "country-flag-icons/react/3x2/NO";
import KZ from "country-flag-icons/react/3x2/KZ";
import IT from "country-flag-icons/react/3x2/IT";
import US from "country-flag-icons/react/3x2/US";
import FR from "country-flag-icons/react/3x2/FR";

const flags: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    ES,
    BG,
    GE,
    NO,
    KZ,
    IT,
    US,
    FR,
};

export function ReviewFlag({ code }: { code: string }) {
    const Flag = flags[code];

    if (!Flag) {
        return null;
    }

    return (
        <span
            className="inline-flex h-3 w-4 shrink-0 overflow-hidden rounded-sm"
            aria-hidden
        >
            <Flag className="h-full w-full" title={code} />
        </span>
    );
}
