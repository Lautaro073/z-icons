"use client"

import { useCallback } from "react"
import { toast } from "sonner"

export type TranslationFn = (key: string) => string

export const useIconClipboard = (translate: TranslationFn) => {
  const handleCopyIcon = useCallback(
    (iconName: string) => {
      if (!iconName) return

      navigator.clipboard.writeText(iconName)
      toast.success(translate("toasts.iconNameCopied"), {
        description: iconName,
      })
    },
    [translate]
  )

  const handleCopyReact = useCallback(
    (icon: { type: string; name: string; variant: string }) => {
      const codeSnippet = `<ZIcon type="${icon.type}" name="${icon.name}" variant="${icon.variant}" />`
      navigator.clipboard.writeText(codeSnippet)
      toast.success(translate("toasts.reactCodeCopied"), {
        description: codeSnippet,
      })
    },
    [translate]
  )

  const handleCopyHtml = useCallback(
    (icon: { type: string; name: string; variant: string }) => {
      const codeSnippet = `<z-icon name="${icon.name}" type="${icon.type}" variant="${icon.variant}" />`
      navigator.clipboard.writeText(codeSnippet)
      toast.success(translate("toasts.htmlCodeCopied"), {
        description: codeSnippet,
      })
    },
    [translate]
  )

  return { handleCopyIcon, handleCopyReact, handleCopyHtml }
}
