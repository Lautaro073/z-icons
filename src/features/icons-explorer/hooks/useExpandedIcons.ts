"use client"

import { useMemo } from "react"
import type { IconGroup } from "@/features/icons-explorer"
import type { IconTypeInfo } from "@/types"

export const useExpandedIcons = (iconsData: IconGroup[]) =>
  useMemo<IconTypeInfo[]>(
    () =>
      iconsData.flatMap((group) =>
        (group.icons ?? []).flatMap((icon) =>
          group.type.map(
            (variant) =>
              ({
                type: group.name,
                name: icon,
                variant,
              } as IconTypeInfo)
          )
        )
      ),
    [iconsData]
  )
