"use client"

import type { IconTypeInfo } from "@/types"
import { IconTileCard } from "./IconTileCard"

interface IconGridListBodyProps {
    icons: IconTypeInfo[]
    itemWidth: number
    isCompact: boolean
    onShowDetail: (icon: IconTypeInfo) => void
    onCopyIcon: (name: string) => void
    onCopyReact: (icon: IconTypeInfo) => void
    onCopyHtml: (icon: IconTypeInfo) => void
}

export const IconGridListBody = ({
    icons,
    itemWidth,
    isCompact,
    onShowDetail,
    onCopyIcon,
    onCopyReact,
    onCopyHtml,
}: IconGridListBodyProps) => (
    <div
        className="grid justify-center sm:justify-start gap-3"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${itemWidth}px, ${itemWidth}px))` }}
    >
        {icons.map((icon, idx) => {
            const id = `${icon.type}:${icon.name}:${icon.variant}:${idx}`

            return (
                <IconTileCard
                    key={id}
                    icon={icon}
                    isCompact={isCompact}
                    onShowDetail={onShowDetail}
                    onCopyIcon={onCopyIcon}
                    onCopyReact={onCopyReact}
                    onCopyHtml={onCopyHtml}
                />
            )
        })}
    </div>
)
