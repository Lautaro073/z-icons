"use client"

import type { IconTypeInfo } from "@/types"
import { IconGridListBody } from "./IconGridListBody"
import { IconGridShowAllButton } from "./IconGridShowAllButton"

interface IconGridListContentProps {
    icons: IconTypeInfo[]
    itemWidth: number
    isCompact: boolean
    hasMore: boolean
    showAll: boolean
    onShowDetail: (icon: IconTypeInfo) => void
    onCopyIcon: (name: string) => void
    onCopyReact: (icon: IconTypeInfo) => void
    onCopyHtml: (icon: IconTypeInfo) => void
    setShowAll: (value: boolean) => void
}

export const IconGridListContent = ({
    icons,
    itemWidth,
    isCompact,
    hasMore,
    showAll,
    onShowDetail,
    onCopyIcon,
    onCopyReact,
    onCopyHtml,
    setShowAll,
}: IconGridListContentProps) => (
    <>
        <IconGridListBody
            icons={icons}
            itemWidth={itemWidth}
            isCompact={isCompact}
            onShowDetail={onShowDetail}
            onCopyIcon={onCopyIcon}
            onCopyReact={onCopyReact}
            onCopyHtml={onCopyHtml}
        />

        <IconGridShowAllButton hasMore={hasMore} showAll={showAll} setShowAll={setShowAll} />
    </>
)
