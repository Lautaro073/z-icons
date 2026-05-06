"use client"

import { Button } from "@/components/ui/button"
import type { IconExportState } from "@/hooks/useIconExport"
import { cn } from "@/lib/utils"

interface IconDetailExportTabsProps {
    state: IconExportState
    onChange: (state: IconExportState) => void
    isCustom?: boolean
}

export const IconDetailExportTabs = ({ state, onChange, isCustom }: IconDetailExportTabsProps) => {
    const tabs: IconExportState[] = isCustom ? ["svg"] : ["react", "svg", "html"]

    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <Button
                    key={tab}
                    variant={state === tab ? "secondary" : "ghost"}
                    className={cn("rounded-full px-3 capitalize", state === tab && "shadow-(--shadow-soft)")}
                    onClick={() => onChange(tab)}
                >
                    {tab}
                </Button>
            ))}
        </div>
    )
}
