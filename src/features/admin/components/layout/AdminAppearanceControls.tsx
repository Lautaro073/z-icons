"use client"

import { useEffect, useMemo } from "react"
import { ZIcon } from "@zcorvus/z-icons/react"
import { useParams, useSearchParams } from "next/navigation"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { DEFAULT_LOCALE, type Locale, LOCALES } from "@/i18n/routing"
import { useUIStore } from "@/store"
import { useAuth } from "@/contexts/AuthContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function getValidIconType(iconSet: string): "neo" | "core" | "mina" {
  if (iconSet === "neo" || iconSet === "core" || iconSet === "mina") {
    return iconSet
  }

  return "mina"
}

function getNextLocale(currentLocale: string): Locale {
  const normalizedCurrent = LOCALES.includes(currentLocale as Locale)
    ? (currentLocale as Locale)
    : DEFAULT_LOCALE

  const currentIndex = LOCALES.indexOf(normalizedCurrent)
  const nextIndex = currentIndex + 1 < LOCALES.length ? currentIndex + 1 : 0
  return LOCALES[nextIndex] as Locale
}

export function AdminAppearanceControls() {
  const admin = useTranslations("admin")
  const common = useTranslations("common")
  const theme = useUIStore((state) => state.theme)
  const setTheme = useUIStore((state) => state.setTheme)
  const iconSet = useUIStore((state) => state.iconSet)
  const validIconType = getValidIconType(iconSet)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useParams()
  const currentLocale = String(params.locale ?? DEFAULT_LOCALE)
  const nextLocale = useMemo(() => getNextLocale(currentLocale), [currentLocale])
  const { logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
    router.push("/auth/login")
  }

  const queryString = searchParams.toString()
  const href = queryString ? `${pathname}?${queryString}` : pathname

  useEffect(() => {
    router.prefetch(href, { locale: nextLocale })
  }, [href, nextLocale, router])

  return (
    <TooltipProvider>
      <div className="ui-glass inline-flex items-center gap-1 rounded-full p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={setTheme}
              aria-label={admin("controls.toggleTheme")}
              className="rounded-full"
            >
              <ZIcon
                name={theme === "dark" ? "moon" : "sun"}
                type={validIconType}
                className="size-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{admin("controls.toggleTheme")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon-sm" className="rounded-full">
              <Link
                href={href}
                locale={nextLocale}
                scroll={false}
                aria-label={admin("controls.toggleLocale")}
              >
                <ZIcon name="language" type={validIconType} className="size-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{admin("controls.toggleLocale")}</TooltipContent>
        </Tooltip>

        <div className="w-[1px] h-4 bg-border/60 mx-0.5" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleSignOut}
              aria-label={common("actions.signOut")}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <ZIcon type="mina" name="logout" className="size-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{common("actions.signOut")}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
