"use client"

import { useTranslations } from "next-intl"
import type { IconGroup } from "@/features/icons-explorer"
import { LayerModes, ICONS_PER_PAGE, ICONS_PER_PAGE_COMPACT } from "@/features/icons-explorer"
import { useUIStore } from "@/store"
import { useExpandedIcons } from "./useExpandedIcons"
import { useIconClipboard } from "./useIconClipboard"
import { useIconPagination } from "./useIconPagination"

export const useIconGrid = (iconsData: IconGroup[]) => {
  const layer = useUIStore((s) => s.layer)
  const isCompact = layer === LayerModes.COMPACT
  const itemWidth = isCompact ? 56 : 120
  const common = useTranslations("common")

  const expandedIcons = useExpandedIcons(iconsData)
  const { handleCopyIcon, handleCopyReact, handleCopyHtml } = useIconClipboard(common)

  const {
    currentPage,
    totalPages,
    paginatedItems: icons,
    goToPage,
    nextPage,
    prevPage,
  } = useIconPagination(expandedIcons, isCompact ? ICONS_PER_PAGE_COMPACT : ICONS_PER_PAGE)

  return {
    isCompact,
    itemWidth,
    icons,
    totalItems: expandedIcons.length,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    handleCopyIcon,
    handleCopyReact,
    handleCopyHtml,
  }
}
