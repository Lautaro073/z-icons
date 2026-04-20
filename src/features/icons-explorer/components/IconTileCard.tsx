"use client";

import { UnifiedIcon } from "@/components/common/UnifiedIcon";
import { cn } from "@/lib/utils";
import { IconTypeInfo } from "@/types";
import { IconTileCardActions } from "./IconTileCardActions";

interface IconTileCardProps {
    icon: IconTypeInfo;
    isCompact: boolean;
    onShowDetail: (icon: IconTypeInfo) => void;
    onCopyIcon: (name: string) => void;
    onCopyReact: (icon: IconTypeInfo) => void;
    onCopyHtml: (icon: IconTypeInfo) => void;
}

export const IconTileCard = ({
    icon,
    isCompact,
    onShowDetail,
    onCopyIcon,
    onCopyReact,
    onCopyHtml,
}: IconTileCardProps) => {
    const iconId = `${icon.type}:${icon.name}:${icon.variant}`;

    return (
        <div
            data-icon-id={iconId}
            className={cn(
                "group relative grid cursor-pointer justify-center rounded-2xl border border-surface-border bg-surface/92 px-2 py-2 shadow-(--shadow-soft) transition-transform duration-180 ease-out hover:-translate-y-px hover:border-foreground/14 hover:bg-surface",
                isCompact ? "h-12 w-12 grid-rows-1" : "h-28 w-28 gap-2 grid-rows-[4fr_3fr]"
            )}
            onClick={() => {
                onShowDetail(icon);
                onCopyIcon(icon.name);
            }}
        >
            <UnifiedIcon
                {...icon}
                className={cn(
                    "justify-self-center text-foreground transition-transform duration-200 ease-out",
                    isCompact ? "self-center" : "self-end"
                )}
            />

            {!isCompact && (
                <p className="text-center text-xs text-muted-foreground line-clamp-2">{icon.name}</p>
            )}

            {!isCompact && (
                <IconTileCardActions icon={icon} onCopyHtml={onCopyHtml} onCopyReact={onCopyReact} />
            )}
        </div>
    );
};
