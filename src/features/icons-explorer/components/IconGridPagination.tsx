"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

interface IconGridPaginationProps {
    currentPage: number
    totalPages: number
    onPrevPage: () => void
    onNextPage: () => void
}

export const IconGridPagination = ({
    currentPage,
    totalPages,
    onPrevPage,
    onNextPage,
}: IconGridPaginationProps) => {
    const common = useTranslations("common")

    if (totalPages <= 1) return null

    return (
        <div className="sticky bottom-0 flex items-center justify-center gap-1.5 pt-4 pb-1 sm:gap-3">
            <Button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                variant="outline"
                size="icon-sm"
                className="bg-background/88 sm:hidden"
                aria-label={common("actions.previous")}
            >
                <ChevronLeft className="size-4" />
            </Button>
            <Button
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                variant="outline"
                size="sm"
                className="hidden rounded-full bg-background/88 sm:inline-flex"
            >
                <ChevronLeft className="size-4" />
                {common("actions.previous")}
            </Button>

            <span className="min-w-16 text-center text-xs tabular-nums text-muted-foreground sm:min-w-24 sm:text-sm">
                {common("actions.pageOf", { current: currentPage, total: totalPages })}
            </span>

            <Button
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
                variant="outline"
                size="icon-sm"
                className="bg-background/88 sm:hidden"
                aria-label={common("actions.next")}
            >
                <ChevronRight className="size-4" />
            </Button>
            <Button
                onClick={onNextPage}
                disabled={currentPage >= totalPages}
                variant="outline"
                size="sm"
                className="hidden rounded-full bg-background/88 sm:inline-flex"
            >
                {common("actions.next")}
                <ChevronRight className="size-4" />
            </Button>
        </div>
    )
}
