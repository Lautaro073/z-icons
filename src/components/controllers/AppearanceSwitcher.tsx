"use client"

import dynamic from "next/dynamic"
import { ZIcon } from "@zcorvus/z-icons/react"
import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"
import { useLocale } from "@/hooks/useLocale"
import { useUIStore } from "@/store"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslations } from "next-intl"

export function AppearanceSwitcher() {
  const pathname = usePathname()
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const { nextLocale } = useLocale()
  const iconSet = useUIStore((s) => s.iconSet)
  const setIconSetDynamic = useUIStore((s) => s.setIconSetDynamic)
  const validIconType = iconSet === "neo" || iconSet === "core" || iconSet === "mina" ? iconSet : "mina"
  const common = useTranslations("common")

  return (
    <TooltipProvider>
      <div className="ui-glass fixed bottom-6 right-6 z-50 inline-flex items-center gap-1 rounded-full p-1 shadow-lg shadow-black/20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={setTheme}
              aria-label={common("actions.toggleTheme")}
              className="rounded-full"
            >
              <ThemeComponent theme={theme} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{common("actions.toggleTheme")}</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
              <Link href={pathname} locale={nextLocale} aria-label={common("actions.toggleLanguage")}>
                <ZIcon
                  name="language"
                  type={validIconType}
                  className="size-4 transition-transform duration-200 ease-[var(--ease-out)]"
                />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{common("actions.toggleLanguage")}</TooltipContent>
        </Tooltip>
        {/* 
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={setIconSetDynamic}
        aria-label="Change icon set"
        className="rounded-full"
      >
        <ZIcon name="anchor" type={validIconType} className="size-4" />
      </Button>
      */}
      </div>
    </TooltipProvider>
  )
}

const ThemeComponent = dynamic<{ theme: string }>(() => Promise.resolve(ThemeButton), { ssr: false })

const ThemeButton = ({ theme }: { theme: string }) => {
  const iconSet = useUIStore((s) => s.iconSet)
  const validIconType = iconSet === "neo" || iconSet === "core" || iconSet === "mina" ? iconSet : "mina"

  return (
    <ZIcon
      name={theme === "dark" ? "moon" : "sun"}
      type={validIconType}
      className="size-4 transition-transform duration-200 ease-[var(--ease-out)]"
    />
  )
}
