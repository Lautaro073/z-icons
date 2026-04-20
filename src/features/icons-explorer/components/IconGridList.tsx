"use client"

import { useIconGrid, IconGroup } from "@/features/icons-explorer"
import { IconTypeInfo } from "@/types"
import { IconGridListContent } from "./IconGridListContent"
import { IconGridSkeleton } from "./IconGridSkeleton"

interface IconGridListProps {
  iconsData: IconGroup[]
  showDetail: boolean
  onShowDetail: (arg: IconTypeInfo) => void
}

const IconGridListComponent = ({ iconsData, onShowDetail, showDetail }: IconGridListProps) => {
  const {
    parentRef,
    columns,
    loading,
    showAll,
    setShowAll,
    isCompact,
    itemWidth,
    icons,
    hasMore,
    handleCopyIcon,
    handleCopyReact,
    handleCopyHtml,
  } = useIconGrid(iconsData, showDetail)

  if (loading) {
    return <IconGridSkeleton count={Math.max(15, icons.length || 15)} isCompact={isCompact} />
  }

  return (
    <div ref={parentRef} className="relative h-full overflow-y-auto pr-1">
      <IconGridListContent
        icons={icons}
        columns={columns}
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
