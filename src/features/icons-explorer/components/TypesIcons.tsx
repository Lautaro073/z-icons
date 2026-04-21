"use client"

import { useTranslations } from "next-intl"
import {
  getIconSetInfo,
  IconSets,
  getCategoryForIcon,
  getCategoryTone,
  isPremiumIcon,
} from "@/features/icons-explorer"
import { useUIStore } from "@/store"
import { TypesIconCard } from "./TypesIconCard"

const TypesIcons = () => {
  const iconSet = useUIStore((state) => state.iconSet)
  const common = useTranslations("common")

  return (
    <div className="grid w-full gap-2.5">
      {IconSets.map((icon) => {
        const currentIcon = getIconSetInfo(icon)
        const category = getCategoryForIcon(icon)
        const premium = isPremiumIcon(icon)
        const active = iconSet === icon
        const statusLabel = premium ? common("icons.pro") : common(`icons.categories.${category}`)

        return (
          <TypesIconCard
            key={icon}
            href={`/icons/${category}/${icon}`}
            label={currentIcon.label}
            subLabel={currentIcon.subLabel}
            active={active}
            premium={premium}
            toneClass={getCategoryTone(icon)}
            statusLabel={statusLabel}
          />
        )
      })}
    </div>
  )
}

export { TypesIcons }
