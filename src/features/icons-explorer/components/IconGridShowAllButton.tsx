"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

interface IconGridShowAllButtonProps {
    hasMore: boolean
    showAll: boolean
    setShowAll: (value: boolean) => void
}

export const IconGridShowAllButton = ({ hasMore, showAll, setShowAll }: IconGridShowAllButtonProps) => {
    const common = useTranslations("common")

    if (!showAll && hasMore) {
        return (
            <div className="sticky bottom-0 flex pt-4">
                <Button onClick={() => setShowAll(true)} variant="outline" className="ml-auto rounded-full bg-background/88">
                    {common("actions.showAll")}
                </Button>
            </div>
        )
    }

    return null
}
