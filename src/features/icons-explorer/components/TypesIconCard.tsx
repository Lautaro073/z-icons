"use client"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface TypesIconCardProps {
    href: string
    label: string
    subLabel: string
    active: boolean
    premium: boolean
    toneClass: string
    statusLabel: string
}

export const TypesIconCard = ({
    href,
    label,
    subLabel,
    active,
    premium,
    toneClass,
    statusLabel,
}: TypesIconCardProps) => (
    <Link
        href={href}
        className={cn(
            "ui-panel-interactive rounded-[1.35rem] border border-surface-border bg-surface/84 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            active && "border-foreground/14 bg-secondary/82 shadow-(--shadow-soft)",
            premium && !active && "border-amber-500/24"
        )}
    >
        <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex flex-1 items-baseline gap-2">
                <div className="flex min-w-0 flex-wrap items-baseline gap-2">
                    <p className="truncate text-base leading-none text-foreground sm:text-lg">{label}</p>
                    <p className="truncate text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{subLabel}</p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.22em]", toneClass)}>
                    {statusLabel}
                </span>
                <span className="text-lg text-foreground/65 transition-transform duration-200 ease-out">&gt;</span>
            </div>
        </div>
    </Link>
)
