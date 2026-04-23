"use client"

import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import type { IconGroup } from "@/features/icons-explorer"
import { LayerModes } from "@/features/icons-explorer"
import { useUIStore } from "@/store"
import { useExpandedIcons } from "./useExpandedIcons"
import { useIconClipboard } from "./useIconClipboard"

const MAX_ICONS = 500

export const useIconGrid = (iconsData: IconGroup[]) => {
  const [showAll, setShowAll] = useState(false)
  const layer = useUIStore((s) => s.layer)
  const isCompact = layer === LayerModes.COMPACT
  const itemWidth = isCompact ? 56 : 120
  const common = useTranslations("common")

  const expandedIcons = useExpandedIcons(iconsData)
  const { handleCopyIcon, handleCopyReact, handleCopyHtml } = useIconClipboard(common)

  const icons = useMemo(
    () => (showAll ? expandedIcons : expandedIcons.slice(0, MAX_ICONS)),
    [expandedIcons, showAll]
  )

  const hasMore = expandedIcons.length > MAX_ICONS

  return {
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
