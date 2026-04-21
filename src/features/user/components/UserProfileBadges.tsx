"use client"

import { cn } from "@/lib/utils"

interface UserProfileBadgesProps {
  userRole: string
  twoFactorEnabled?: boolean
}

const badgeClasses =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"

export const UserProfileBadges = ({ userRole, twoFactorEnabled }: UserProfileBadgesProps) => {
  const badges = [
    {
      show: userRole === "pro",
      label: "PRO",
      className: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
    },
    {
      show: Boolean(twoFactorEnabled),
      label: "2FA",
      className: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.filter((badge) => badge.show).map((badge) => (
        <span key={badge.label} className={cn(badgeClasses, badge.className)}>
          {badge.label}
        </span>
      ))}
    </div>
  )
}
