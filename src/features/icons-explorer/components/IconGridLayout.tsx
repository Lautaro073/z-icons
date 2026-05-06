"use client"

import type { IconGroup } from "@/features/icons-explorer"
import type { IconTypeInfo } from "@/types"
import { IconDetailPanel } from "./IconDetailPanel"
import { IconGridHighlightStyles } from "./IconGridHighlightStyles"
import { IconGridList } from "./IconGridList"

interface IconGridLayoutProps {
    data: IconGroup[]
    activeIcon: IconTypeInfo | null
    activeIconId: string
    onShowDetail: (icon: IconTypeInfo) => void
    onClose: () => void
}

export const IconGridLayout = ({
    data,
    activeIcon,
    activeIconId,
    onShowDetail,
    onClose,
}: IconGridLayoutProps) => (
    <div data-active-icon={activeIconId} className="flex h-full min-h-128 flex-col gap-4 lg:flex-row">
        <IconGridHighlightStyles activeIconId={activeIconId} />

        <div className="min-h-96 min-w-0 flex-1 overflow-hidden rounded-[1.6rem] border border-surface-border bg-background/58 p-3 sm:p-4">
            <IconGridList iconsData={data} onShowDetail={onShowDetail} />
        </div>

        {activeIcon && (
            <div className="min-w-0 lg:w-[360px] lg:min-w-[320px]">
                <IconDetailPanel key={activeIcon.type + ":" + activeIcon.name} icon={activeIcon} onClose={onClose} />
            </div>
        )}
    </div>
)
