"use server";

import { getIconSetsByCategory, IconCategorySection, IconLandingHero } from "@/features/icons-explorer";
import { getTranslations } from "@/i18n/server";

const categorySections = ["local", "external", "premium"] as const;

export default async function IconsLocalePage() {
  const home = await getTranslations("home");
  const common = await getTranslations("common");

  return (
    <div className="ui-page-shell py-2">
      <IconLandingHero home={home} common={common} />

      <div className="grid gap-4 sm:gap-5 xl:gap-6">
        {categorySections.map((category, index) => {
          const title = home(`icons.${category}.title`);
          const description = home(`icons.${category}.description`);

          return (
            <IconCategorySection
              key={category}
              category={category}
              title={title}
              description={description}
              sets={getIconSetsByCategory(category)}
              common={common}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}
