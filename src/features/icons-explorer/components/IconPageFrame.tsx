"use client";

import type { ChangeEvent } from "react";
import { IconGrid } from "@/features/icons-explorer";
import type { IconGroup } from "@/types";
import { IconPageHeader } from "./IconPageHeader";

interface IconPageFrameProps {
  title: string;
  backHref: string;
  badgeLabel: string;
  tone: string;
  searchValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onToggleLayers: () => void;
  searchPlaceholder: string;
  layerButtonLabel: string;
  data: IconGroup[];
}

export const IconPageFrame = ({
  title,
  backHref,
  badgeLabel,
  tone,
  searchValue,
  onSearchChange,
  onToggleLayers,
  searchPlaceholder,
  layerButtonLabel,
  data,
}: IconPageFrameProps) => (
  <div className="ui-page-shell py-2">
    <IconPageHeader
      title={title}
      backHref={backHref}
      badgeLabel={badgeLabel}
      tone={tone}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onToggleLayers={onToggleLayers}
      searchPlaceholder={searchPlaceholder}
      layerButtonLabel={layerButtonLabel}
    />

    <section className="ui-surface-panel min-h-144 rounded-4xl p-3 sm:p-4 overflow-hidden overflow-y-auto">
      <IconGrid data={data} />
    </section>
  </div>
);
