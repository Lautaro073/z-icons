"use client"

import { useCallback, useState } from "react"
import type { IconTypeInfo } from "@/types"

export const useActiveIcon = () => {
  const [activeIcon, setActiveIcon] = useState<IconTypeInfo | null>(null)

  const handleShowDetail = useCallback((icon: IconTypeInfo) => {
    setActiveIcon(icon)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setActiveIcon(null)
  }, [])

  const activeIconId = activeIcon ? `${activeIcon.type}:${activeIcon.name}:${activeIcon.variant}` : ""

  return {
    activeIcon,
    showDetail: Boolean(activeIcon),
    handleShowDetail,
    handleCloseDetail,
    activeIconId,
  }
}
