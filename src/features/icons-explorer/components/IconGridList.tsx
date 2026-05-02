"use client"

import { useIconGrid, IconGroup } from "@/features/icons-explorer"
import { IconTypeInfo } from "@/types"
import { IconGridListContent } from "./IconGridListContent"

interface IconGridListProps {
  iconsData: IconGroup[]
  onShowDetail: (arg: IconTypeInfo) => void
}

const IconGridListComponent = ({ iconsData, onShowDetail }: IconGridListProps) => {
  const {
    isCompact,
    itemWidth,
    icons,
    currentPage,
    totalPages,
    prevPage,
    nextPage,
    handleCopyIcon,
    handleCopyReact,
    handleCopyHtml,
  } = useIconGrid(iconsData)

  return (
    <div className="relative h-full overflow-y-auto pr-1">
      <IconGridListContent
        icons={icons}
        itemWidth={itemWidth}
        isCompact={isCompact}
        currentPage={currentPage}
        totalPages={totalPages}
        onShowDetail={onShowDetail}
        onCopyIcon={handleCopyIcon}
        onCopyReact={handleCopyReact}
        onCopyHtml={handleCopyHtml}
        onPrevPage={prevPage}
        onNextPage={nextPage}
      />
    </div>
  )
}

IconGridListComponent.displayName = "IconGridListComponent"
export const IconGridList = IconGridListComponent
