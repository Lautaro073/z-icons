"use client";

import { use, useMemo } from "react";
import { getIconContentData } from "@/features/icons-explorer";
import type { IconContent } from "@/types";

export const useIconContentData = () => {
  const iconContentPromise = useMemo(() => getIconContentData(), []);
  return use(iconContentPromise) as IconContent;
};
