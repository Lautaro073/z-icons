"use client";

import { useMemo, useState } from "react";
import type { IconGroup } from "@/features/icons-explorer";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";


export const useIconSearch = (data: IconGroup[]) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 200);
  const normalizedSearch = debouncedSearch.trim().toLowerCase();

  const filteredData = useMemo(() => {
    if (!normalizedSearch) {
      return data;
    }

    return data
      .map((group) => ({
        ...group,
        icons: group.icons?.filter((iconName) =>
          String(iconName).toLowerCase().includes(normalizedSearch)
        ),
      }))
      .filter((group) => (group.icons?.length ?? 0) > 0);
  }, [data, normalizedSearch]);

  return { search, setSearch, filteredData };
};
