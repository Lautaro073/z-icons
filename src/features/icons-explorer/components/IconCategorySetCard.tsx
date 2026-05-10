import { getIconSetInfo } from "@/features/icons-explorer"
import { Link } from "@/i18n/navigation"
import type { IconCategory, IconSet } from "@/types"


interface IconCategorySetCardProps {
  category: IconCategory
  set: IconSet
  description: string
}

export const IconCategorySetCard = ({ category, set, description }: IconCategorySetCardProps) => {
  const { label, subLabel, customBadge, customDescription } = getIconSetInfo(set)

  return (
    <li className="h-full">
      <Link
        href={`/icons/${category}/${set}`}
        className="ui-panel-interactive group flex h-full min-h-[172px] flex-col justify-between rounded-3xl border border-surface-border bg-surface/84 px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            {customBadge || set}
          </span>
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl leading-none text-foreground sm:text-[2rem]">{label}</span>
              <span className="text-lg leading-none text-muted-foreground sm:text-xl">{subLabel}</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{customDescription || description}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end border-t border-border/60 pt-3 text-xs uppercase tracking-[0.22em] text-foreground/78">
          <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">&gt;</span>
        </div>
      </Link>
    </li>
  )
}
