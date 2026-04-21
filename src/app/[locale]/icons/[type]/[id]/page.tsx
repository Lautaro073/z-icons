"use client";

import { useTranslations } from "next-intl";
import { use } from "react";
import { PremiumGuard } from "@/components/guards/PremiumGuard";
import { IconPageFrame, useIconTypePage } from "@/features/icons-explorer";
import { useUIStore } from "@/store";
import type { IconCategory, IconSet } from "@/types";

interface IconsTypeIdPageProps {
  params: Promise<{ type: IconCategory; id: IconSet }>;
}

export default function IconsTypeIdPage({ params }: IconsTypeIdPageProps) {
  const common = useTranslations("common");
  const setLayerDynamic = useUIStore((e) => e.setLayerDynamic);
  const { type, id } = use(params);
  const { search, setSearch, filteredData, tone } = useIconTypePage({ type, id });

  const isPremiumContent = type === "premium" || id === "fa-solid" || id === "fa-regular";

  const content = (
    <IconPageFrame
      title={id}
      backHref="/icons"
      badgeLabel={common("icons.set")}
      tone={tone}
      searchValue={search}
      onSearchChange={(event) => setSearch(event.currentTarget.value)}
      onToggleLayers={setLayerDynamic}
      searchPlaceholder={common("actions.search")}
      layerButtonLabel={common("actions.layers")}
      data={filteredData}
    />
  );

  if (isPremiumContent) {
    return <PremiumGuard>{content}</PremiumGuard>;
  }

  return content;
}
