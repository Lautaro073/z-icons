"use client"

import { UnifiedIcon } from "@/components/common/UnifiedIcon"
import type { IconTypeInfo } from "@/types"

interface IconDetailPreviewProps {
    icon: IconTypeInfo
}

export const IconDetailPreview = ({ icon }: IconDetailPreviewProps) => (
    <div className="rounded-3xl border border-surface-border bg-secondary/68 p-5 max-[820px]:p-4 max-[720px]:p-3">
        <div className="grid min-h-[220px] place-items-center rounded-[1.2rem] border border-border/60 bg-background/72 max-[820px]:min-h-[180px] max-[720px]:min-h-[148px]">
            <UnifiedIcon
                {...icon}
                size={132}
                className="text-foreground max-[820px]:scale-[0.86] max-[720px]:scale-[0.74]"
            />
        </div>
    </div>
)
