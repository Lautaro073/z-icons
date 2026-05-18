"use client"

import { ZIcon } from "@zcorvus/z-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { UserProfileBadges } from "./UserProfileBadges"

const UserProfileCard = () => {
  const { user, isLoading, logout } = useAuth()
  const auth = useTranslations("auth")
  const common = useTranslations("common")
  const locale = useLocale()
  const router = useRouter()
  const userRole = user?.role_name || "user"
  const tokenFinishDate = user?.token_finish_date
  const emailInitial = user?.email?.charAt(0)?.toUpperCase() ?? "?"

  const handleSignOut = async () => {
    await logout()
    router.push("/auth/login")
  }

  if (!isLoading && !user) {
    return (
      <Button
        variant="outline"
        aria-label="Sign in"
        className="min-w-0 max-w-full rounded-full px-4"
        onClick={() => router.push("/auth/login")}
      >
        <p className="truncate">{auth("actions.signIn")}</p>
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label="User profile"
          className={cn(
            "min-w-0 max-w-full rounded-full px-3.5 sm:px-4",
            user && "uppercase"
          )}
        >
          {isLoading && <div className="h-2 w-20 rounded-full bg-muted-foreground/20 animate-pulse" />}

          {!isLoading && user && (
            <>
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-foreground">
                {emailInitial}
              </span>
              <p className="max-w-[min(44vw,14rem)] truncate text-xs sm:max-w-48 sm:text-sm">
                {user.username}
              </p>
              <div className="size-2 rounded-full bg-emerald-500" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(28rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-[1.65rem] p-5 sm:p-6"
        side="bottom"
        align="end"
        sideOffset={12}
        alignOffset={0}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="grid gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid size-16 place-items-center rounded-[1.4rem] bg-accent text-xl font-semibold text-foreground shadow-(--shadow-soft)">
                {emailInitial}
              </div>
              <div className="space-y-1">
                <p className="ui-section-header">{common("profile.name")}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="leading-tight text-foreground">{user?.username}</p>
                  <UserProfileBadges userRole={userRole} twoFactorEnabled={user?.two_factor_enabled} />
                </div>
              </div>
            </div>
             <div className="flex items-center gap-2">
              {/* {userRole === "admin" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        className="border border-border/60 bg-card/24 text-muted-foreground transition-[transform,background-color,border-color,color] duration-160 ease-out hover:border-border hover:bg-card/60 hover:text-foreground active:scale-[0.985]"
                      >
                        <Link href="/admin" aria-label={common("actions.openAdmin")}>
                          <ZIcon type="mina" name="user-settings" className="size-4 text-current" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{common("actions.openAdmin")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )} */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleSignOut}
                      aria-label={common("actions.signOut")}
                    >
                      <ZIcon type="mina" name="logout" className="size-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{common("actions.signOut")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> 
          </div>

          <div className="ui-divider" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="ui-section-header">{common("profile.email")}</p>
              <p className="break-all text-sm leading-6 text-foreground">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="ui-section-header">{common("profile.language")}</p>
              <p className="text-sm leading-6 text-foreground capitalize">{locale === "es" ? "Español" : "English"}</p>
            </div>
            <div className="space-y-1">
              <p className="ui-section-header">{common("profile.role")}</p>
              <p className="text-sm leading-6 text-foreground capitalize">{common(`profile.roles.${userRole}`)}</p>
            </div>
            {userRole === "pro" && tokenFinishDate && (
              <div className="space-y-1">
                <p className="ui-section-header">{common("profile.tokenExpires")}</p>
                <p className="text-sm leading-6 text-foreground">
                  {new Intl.DateTimeFormat(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(tokenFinishDate))}
                </p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { UserProfileCard }
