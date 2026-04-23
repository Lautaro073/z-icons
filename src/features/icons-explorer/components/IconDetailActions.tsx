"use client"

import { ZIcon } from "@zcorvus/z-icons/react"
import { Button } from "@/components/ui/button"

interface IconDetailActionButton {
    key: string
    iconName: "download" | "copy"
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

interface IconDetailActionsProps {
    actionButtons: IconDetailActionButton[]
}

export const IconDetailActions = ({ actionButtons }: IconDetailActionsProps) => (
    <div className="mt-6 flex flex-none items-center justify-end gap-2">
        {actionButtons.map((button) => (
            <Button key={button.key} variant="outline" size="sm" className="rounded-full" onClick={button.onClick}>
                <ZIcon type="mina" name={button.iconName} className="size-4" />
            </Button>
        ))}
    </div>
)
