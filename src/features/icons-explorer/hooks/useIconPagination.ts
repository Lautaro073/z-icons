"use client"

import { useCallback, useMemo, useState } from "react"
import { ICONS_PER_PAGE } from "@/features/icons-explorer"

interface UseIconPaginationResult<T> {
  currentPage: number
  totalPages: number
  paginatedItems: T[]
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
}

export const useIconPagination = <T>(
  items: T[],
  pageSize: number = ICONS_PER_PAGE
): UseIconPaginationResult<T> => {
  const [currentPage, setCurrentPage] = useState(1)
  const [prevLength, setPrevLength] = useState(items.length)
  const [prevPageSize, setPrevPageSize] = useState(pageSize)

  // Resetear a página 1 cuando cambia la lista (ej: búsqueda)
  if (items.length !== prevLength) {
    setPrevLength(items.length)
    setCurrentPage(1)
  }

  // Recalcular página al cambiar de modo para mantener los mismos iconos visibles
  if (pageSize !== prevPageSize) {
    const firstVisibleIndex = (currentPage - 1) * prevPageSize
    const newPage = Math.max(1, Math.ceil((firstVisibleIndex + 1) / pageSize))
    setPrevPageSize(pageSize)
    setCurrentPage(newPage)
  }

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  )

  // Derivar la página segura sin useEffect (clamp)
  const safePage = Math.max(1, Math.min(currentPage, totalPages))

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(clamped)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    goToPage(safePage + 1)
  }, [safePage, goToPage])

  const prevPage = useCallback(() => {
    goToPage(safePage - 1)
  }, [safePage, goToPage])

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  }
}
