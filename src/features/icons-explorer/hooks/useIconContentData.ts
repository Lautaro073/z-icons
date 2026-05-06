"use client";

import { use } from "react";
import { getIconContentPromise } from "@/features/icons-explorer";
import type { IconContent } from "@/types";

export const useIconContentData = () => {
  const iconContentPromise = getIconContentPromise();
  return use(iconContentPromise) as IconContent;
};
