"use client"

import { ZIcon } from "@zcorvus/z-icons/react"
import { IconTypeInfo } from "@/types"


interface IconTileCardActionsProps {
    icon: IconTypeInfo
    onCopyReact: (icon: IconTypeInfo) => void
    onCopyHtml: (icon: IconTypeInfo) => void
}

export const IconTileCardActions = ({ icon, onCopyReact, onCopyHtml }: IconTileCardActionsProps) => (
    <div className="absolute -right-px -top-px flex h-[calc(100%+2px)] w-8 flex-col items-center justify-center gap-1 rounded-r-2xl rounded-tl-none border border-surface-border bg-background/94 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100">
        <button
            onClick={(event) => {
                event.stopPropagation()
                onCopyHtml(icon)
            }}
            className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
            <ZIcon type="mina" name="file-text" className="size-3.5" />
        </button>
        <button
            onClick={(event) => {
                event.stopPropagation()
                onCopyReact(icon)
            }}
            className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
            <ZIcon type="mina" name="code" className="size-3.5" />
        </button>
    </div>
)
