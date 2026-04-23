"use client";

import { useMemo } from "react";
import {
  getIconSetsByCategory,
  getIconSetInfo,
  getCategoryToneByCategory,
  useIconContentData,
  useIconSearch,
} from "@/features/icons-explorer";
import type { IconCategory, IconGroup, IconSet } from "@/types";

interface UseIconTypePageProps {
  type: IconCategory;
  id?: IconSet;
}

export const useIconTypePage = ({ type, id }: UseIconTypePageProps) => {
  const iconContentData = useIconContentData();

  const data: IconGroup[] = useMemo(() => {
    if (id) {
      return [
        {
          name: id,
          icons: iconContentData[type][id],
          type: getIconSetInfo(id).type,
        },
      ];
    }

    return (
      getIconSetsByCategory(type)?.map((name) => ({
        name,
        icons: iconContentData[type][name],
        type: getIconSetInfo(name).type,
      })) ?? []
    );
  }, [iconContentData, id, type]);

  const { search, setSearch, filteredData } = useIconSearch(data);
  const tone = getCategoryToneByCategory(type);

  return {
    search,
    setSearch,
    filteredData,
    tone,
  };
};
