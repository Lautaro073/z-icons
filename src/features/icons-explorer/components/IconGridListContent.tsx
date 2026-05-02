"use client"

import type { IconTypeInfo } from "@/types"
import { IconGridListBody } from "./IconGridListBody"
import { IconGridPagination } from "./IconGridPagination"

interface IconGridListContentProps {
    icons: IconTypeInfo[]
    itemWidth: number
    isCompact: boolean
    currentPage: number
    totalPages: number
    onShowDetail: (icon: IconTypeInfo) => void
    onCopyIcon: (name: string) => void
    onCopyReact: (icon: IconTypeInfo) => void
    onCopyHtml: (icon: IconTypeInfo) => void
    onPrevPage: () => void
    onNextPage: () => void
}

export const IconGridListContent = ({
    icons,
    itemWidth,
    isCompact,
    currentPage,
    totalPages,
    onShowDetail,
    onCopyIcon,
    onCopyReact,
    onCopyHtml,
    onPrevPage,
    onNextPage,
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

        <IconGridPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
        />
    </>
)
