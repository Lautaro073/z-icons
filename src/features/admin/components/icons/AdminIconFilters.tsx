"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { AdminSelect } from "../shared/AdminSelect";

interface AdminIconFiltersProps {
  admin: (key: string) => string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTier: string;
  onTierChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedCreator: string;
  onCreatorChange: (value: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (value: string) => void;
  uniqueCategories: string[];
  uniqueCreators: { id: string; name: string }[];
}

export function AdminIconFilters({
  admin,
  searchQuery,
  onSearchChange,
  selectedTier,
  onTierChange,
  selectedCategory,
  onCategoryChange,
  selectedCreator,
  onCreatorChange,
  selectedDateRange,
  onDateRangeChange,
  uniqueCategories,
  uniqueCreators,
}: AdminIconFiltersProps) {
  return (
    <section className="ui-surface-panel rounded-[1.85rem] p-4 sm:p-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input
          placeholder={admin("filters.searchPlaceholder")}
          value={searchQuery}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.currentTarget.value)}
        />

        <AdminSelect
          value={selectedTier}
          onChange={onTierChange}
          ariaLabel={admin("filters.ariaTier")}
          options={[
            { value: "all", label: admin("form.tierAll") },
            { value: "free", label: admin("form.tierFree") },
            { value: "premium", label: admin("form.tierPremium") }
          ]}
        />

        <AdminSelect
          value={selectedCategory}
          onChange={onCategoryChange}
          ariaLabel={admin("filters.ariaCategory")}
          options={[
            { value: "all", label: admin("filters.allCategories") },
            ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
          ]}
        />

        <AdminSelect
          value={selectedCreator}
          onChange={onCreatorChange}
          ariaLabel={admin("filters.ariaCreator")}
          options={[
            { value: "all", label: admin("filters.allCreators") },
            ...uniqueCreators.map(c => ({ value: c.id, label: c.name }))
          ]}
        />

        <AdminSelect
          value={selectedDateRange}
          onChange={onDateRangeChange}
          ariaLabel={admin("filters.ariaDate")}
          options={[
            { value: "all", label: admin("filters.anyDate") },
            { value: "today", label: admin("filters.today") },
            { value: "week", label: admin("filters.lastWeek") },
            { value: "month", label: admin("filters.lastMonth") },
          ]}
        />
      </div>
    </section>
  );
}
