"use client"

import { ZIcon } from "@zcorvus/z-icons/react"
import { useState } from "react"
import { InstallCommandBlock } from "@/components/common/InstallCommandBlock"
import { Button } from "@/components/ui/button"
import { IconExportState, useIconExport } from "../hooks/useIconExport"
import { usePremiumAccess } from "@/hooks/usePremiumAccess"
import { IconSet, IconTypeInfo } from "@/types"
import { IconCategories } from "../constants/icon.constants"
import { IconDetailActions } from "./IconDetailActions"
import { IconDetailExportTabs } from "./IconDetailExportTabs"
import { IconDetailPremiumCTA } from "./IconDetailPremiumCTA"
import { IconDetailPreview } from "./IconDetailPreview"

interface IconDetailPanelProps {
  icon: IconTypeInfo
  onClose?: () => void
}

type ActionButton = {
  key: string
  iconName: "download" | "copy"
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const IconDetailPanel = ({ icon, onClose }: IconDetailPanelProps) => {
  const isAnyCustom = icon.type === 'custom' || icon.type === 'custom-premium'
  const [state, setState] = useState<IconExportState>(isAnyCustom ? 'svg' : 'react')
  const { hasAccess } = usePremiumAccess()

  const { codeSnippet, handleCopyIcon, handleCopyCode, handleDownloadIcon } =
    useIconExport({ icon, state })

  const isPremiumIcon = IconCategories.premium.includes(icon.type as IconSet)
  const isLocked = isPremiumIcon && !hasAccess

  const actionButtons: ActionButton[] = [
    { key: "download", iconName: "download", onClick: handleDownloadIcon },
    { key: "copy", iconName: "copy", onClick: handleCopyCode },
  ]

  return (
    <aside className="ui-surface-panel flex h-full min-h-96 min-w-0 w-full flex-col overflow-hidden rounded-[1.65rem] p-4 sm:p-5 lg:p-6">
      <div className="flex flex-none items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <button
            onClick={handleCopyIcon}
            className="inline-flex max-w-full items-start gap-2 text-left text-xl capitalize text-foreground transition-colors duration-150 hover:text-foreground/80"
          >
            <span className="min-w-0 wrap-anywhere">{icon.name}</span>
            <ZIcon type="mina" name="copy" className="mt-1 size-4 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <Button onClick={onClose} variant="ghost" size="icon-sm">
          <ZIcon type="mina" name="x" className="size-4" />
        </Button>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid gap-4 max-[820px]:gap-3">
          <IconDetailPreview icon={icon} />

          {isLocked ? (
            <IconDetailPremiumCTA />
          ) : (
            <div className="min-w-0 space-y-3 max-[820px]:space-y-2">
              <IconDetailExportTabs state={state} onChange={setState} isCustom={isAnyCustom} />

              <div className="ui-code-block min-w-0 max-w-full overflow-auto p-4 max-[820px]:max-h-42 max-[720px]:max-h-32">
                <code className="block max-w-full select-all whitespace-pre-wrap wrap-anywhere">
                  {codeSnippet}
                </code>
              </div>
              
              {!isAnyCustom && (
                <div className="flex justify-end pt-1">
                  <InstallCommandBlock variant="terminal" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!isLocked && <IconDetailActions actionButtons={actionButtons} />}
    </aside>
  )
}

export { IconDetailPanel }
