"use client"

import { useTranslations } from "next-intl"
import { useMemo, useRef, useState } from "react"
import type { IconGroup } from "@/features/icons-explorer"
import { LayerModes } from "@/features/icons-explorer"
import { useUIStore } from "@/store"
import { useExpandedIcons } from "./useExpandedIcons"
import { useIconClipboard } from "./useIconClipboard"
import { useIconColumns } from "./useIconColumns"

const MAX_ICONS = 500

export const useIconGrid = (iconsData: IconGroup[], showDetail: boolean) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const [showAll, setShowAll] = useState(false)
  const layer = useUIStore((s) => s.layer)
  const isCompact = layer === LayerModes.COMPACT
  const itemWidth = isCompact ? 56 : 120
  const common = useTranslations("common")

  const { columns, loading } = useIconColumns(parentRef, itemWidth, showDetail)
  const expandedIcons = useExpandedIcons(iconsData)
  const { handleCopyIcon, handleCopyReact, handleCopyHtml } = useIconClipboard(common)

  const icons = useMemo(
    () => (showAll ? expandedIcons : expandedIcons.slice(0, MAX_ICONS)),
    [expandedIcons, showAll]
  )

  const hasMore = expandedIcons.length > MAX_ICONS

  return {
    parentRef,
    columns,
    loading,
    showAll,
    setShowAll,
    isCompact,
    itemWidth,
    icons,
    hasMore,
    totalItems: icons.length,
    handleCopyIcon,
    handleCopyReact,
    handleCopyHtml,
  }
}
