"use client"

import { cn } from "@/lib/utils"

interface IconGridSkeletonProps {
    count: number
    isCompact: boolean
}

export const IconGridSkeleton = ({ count, isCompact }: IconGridSkeletonProps) => (
    <div className="flex h-auto max-h-full w-full flex-wrap gap-3 overflow-y-auto pb-1">
        {Array.from({ length: count }).map((_, index) => (
            <div
                key={index}
                className={cn(
                    "animate-pulse rounded-[1.25rem] border border-surface-border bg-muted/70",
                    isCompact ? "h-12 w-12" : "h-28 w-28"
                )}
            />
        ))}
    </div>
)
