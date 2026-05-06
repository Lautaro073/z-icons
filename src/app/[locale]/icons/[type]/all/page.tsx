"use client";

import { useTranslations } from "next-intl";
import { use, useEffect } from "react";
import { IconPageFrame, useIconTypePage, clearIconContentCache } from "@/features/icons-explorer";
import { useUIStore } from "@/store";
import type { IconCategory } from "@/types";

interface IconsTypeAllPageProps {
  params: Promise<{
    type: IconCategory;
  }>;
}

export default function IconsTypeAllPage({ params }: IconsTypeAllPageProps) {
  useEffect(() => {
    clearIconContentCache();
  }, []);

  const common = useTranslations("common");
  const setLayerDynamic = useUIStore((e) => e.setLayerDynamic);
  const { type } = use(params);
  const { search, setSearch, filteredData, tone } = useIconTypePage({ type });

  return (
    <IconPageFrame
      title={type}
      backHref="/icons"
      badgeLabel={common("icons.category")}
      tone={tone}
      searchValue={search}
      onSearchChange={(event) => setSearch(event.currentTarget.value)}
      onToggleLayers={setLayerDynamic}
      searchPlaceholder={common("actions.search")}
      layerButtonLabel={common("actions.layers")}
      data={filteredData}
    />
  );
}
