"use client"

import { useEffect, useEffectEvent, useState } from "react"
import type { MutableRefObject } from "react"

export const useIconColumns = (
  parentRef: MutableRefObject<HTMLDivElement | null>,
  itemWidth: number,
  showDetail: boolean,
) => {
  const [columns, setColumns] = useState(1)
  const [loading, setLoading] = useState(true)

  const updateColumns = useEffectEvent(() => {
    const width = parentRef.current?.clientWidth ?? 0
    const cols = Math.max(Math.floor(width / itemWidth), 1)

    setColumns((prev) => (prev === cols ? prev : cols))
    setLoading(false)
  })

  useEffect(() => {
    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [itemWidth, showDetail])

  return { columns, loading }
}
