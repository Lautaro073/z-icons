import type { IconCategory, IconSet } from "@/types"
import { IconCategories } from "../constants"


export const getCategoryForIcon = (icon: IconSet): IconCategory => {
  for (const [category, sets] of Object.entries(IconCategories) as [IconCategory, IconSet[]][]) {
    if (sets.includes(icon)) {
      return category
    }
  }

  return "local"
}

export const isPremiumIcon = (icon: IconSet) => IconCategories.premium.includes(icon)

export const getCategoryTone = (icon: IconSet) => {
  const category = getCategoryForIcon(icon)

  if (category === "premium") return "bg-amber-500/12 text-amber-700 dark:text-amber-300"
  if (category === "external") return "bg-sky-500/12 text-sky-700 dark:text-sky-300"
  return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
}

export const getCategoryToneByCategory = (category: IconCategory) => {
  if (category === "premium") return "bg-amber-500/12 text-amber-700 dark:text-amber-300"
  if (category === "external") return "bg-sky-500/12 text-sky-700 dark:text-sky-300"
  return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
}
