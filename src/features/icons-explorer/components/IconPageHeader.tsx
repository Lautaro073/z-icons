"use client";

import { ZIcon } from "@zcorvus/z-icons/react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Link } from "@/i18n/navigation";

interface IconPageHeaderProps {
  title: string;
  backHref: string;
  badgeLabel: string;
  tone: string;
  searchValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onToggleLayers: () => void;
  searchPlaceholder: string;
  layerButtonLabel: string;
}

export const IconPageHeader = ({
  title,
  backHref,
  badgeLabel,
  tone,
  searchValue,
  onSearchChange,
  onToggleLayers,
  searchPlaceholder,
  layerButtonLabel,
}: IconPageHeaderProps) => (
  <section className="ui-surface-panel-muted rounded-4xl px-4 py-5 sm:px-6 sm:py-6">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-3 rounded-[1.25rem] p-1.5 transition-transform duration-180 ease-out hover:bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="grid size-12 place-items-center">
            <ZIcon type="mina" name="arrow-left" className="size-5 text-muted-foreground" />
          </span>
          <h1 className="ui-display-title text-[clamp(2rem,4.8vw,3.5rem)] leading-tight capitalize">
            {title}
          </h1>
        </Link>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.24em] ${tone}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="w-full max-w-[720px] space-y-3">
        <InputGroup>
          <InputGroupAddon>
            <ZIcon type="mina" name="search" />
          </InputGroupAddon>
          <InputGroupInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </InputGroup>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" aria-label={layerButtonLabel} onClick={onToggleLayers} className="rounded-full">
            <ZIcon type="mina" name="layers-three" />
            {layerButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  </section>
);
