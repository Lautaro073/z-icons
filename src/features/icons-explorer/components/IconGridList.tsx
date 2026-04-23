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
    showAll,
    setShowAll,
    isCompact,
    itemWidth,
    icons,
    hasMore,
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
        hasMore={hasMore}
        showAll={showAll}
        setShowAll={setShowAll}
        onShowDetail={onShowDetail}
        onCopyIcon={handleCopyIcon}
        onCopyReact={handleCopyReact}
        onCopyHtml={handleCopyHtml}
      />
    </div>
  )
}

IconGridListComponent.displayName = "IconGridListComponent"
export const IconGridList = IconGridListComponent
