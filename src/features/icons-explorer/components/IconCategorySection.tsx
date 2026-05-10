import { getCategoryToneByCategory, getIconSetInfo } from "@/features/icons-explorer"
import { Link } from "@/i18n/navigation"
import type { IconCategory, IconSet } from "@/types"
import { IconCategorySetCard } from "./IconCategorySetCard"

interface IconCategorySectionProps {
  category: IconCategory
  title: string
  description: string
  sets: IconSet[]
  common: (key: string) => string
  index: number
}

export const IconCategorySection = ({
  category,
  title,
  description,
  sets,
  common,
  index,
}: IconCategorySectionProps) => {
  const tone = getCategoryToneByCategory(category)

  return (
    <section className="ui-surface-panel-muted rounded-4xl p-5 sm:p-6">
      <div className="flex flex-col gap-5 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.24em] ${tone}`}>
            {common(`icons.categories.${category}`)}
          </span>
          <div className="space-y-2">
            <Link
              href={`/icons/${category}/all`}
              style={index === 0 ? { viewTransitionName: "title-type" } : undefined}
              className="inline-flex items-center gap-3 text-xl text-foreground transition-transform duration-180 ease-out hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-2xl"
            >
              <span>{title}</span>
            </Link>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sets.map((set) => {
            const { customBadge } = getIconSetInfo(set);
            return (
              <span
                key={set}
                className="rounded-full border border-surface-border bg-background/76 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
              >
                {customBadge || set}
              </span>
            );
          })}
        </div>
      </div>

      <ul className="mt-5 grid gap-3 lg:grid-cols-2">
        {sets.map((set) => (
          <IconCategorySetCard
            key={set}
            category={category}
            set={set}
            description={description}
          />
        ))}
      </ul>
    </section>
  )
}
