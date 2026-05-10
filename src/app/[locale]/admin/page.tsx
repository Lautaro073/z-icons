"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  AdminDashboardHero,
  AdminDashboardTabs,
  AdminUserFilters,
  AdminMetricsSection,
  useAdminDashboardPage,
  KPICards,
  AdminIconsSection,
} from "@/features/admin/index";

const AdminTablesSection = dynamic(
  () => import("@/features/admin/index").then((module) => module.AdminTablesSection),
  { ssr: false }
);

export default function AdminDashboardPage() {
  const admin = useTranslations("admin");
  const common = useTranslations("common");

  const {
    activeTab,
    onTabChange,
    usersParams,
    metricsParams,
    selectedPlanType,
    isRangePopoverOpen,
    customRangeDraft,
    searchInputValue,
    setSearchInputValue,
    maxSelectableDate,
    maxSelectableDateInput,
    canLoadAdminData,
    visibleColumns,
    customRangeValue,
    customRangeLabel,
    metricsQuery,
    onGranularityChange,
    onCustomRangeChange,
    onCustomRangeInputChange,
    onRangePopoverOpenChange,
    cancelCustomRangeDraft,
    applyCustomRangeDraft,
    onRoleChange,
    onSubscriptionStatusChange,
    onAccountStatusChange,
    onPlanTypeChange,
    onUsersPageChange,
    onToggleColumnVisibility,
    kpiCards,
  } = useAdminDashboardPage();

  return (
    <div className="ui-page-shell py-2">
      <AdminDashboardHero
        admin={admin}
        common={common}
        activeTab={activeTab}
      />

      <AdminDashboardTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        labels={{
          users: admin("tabs.users"),
          stats: admin("tabs.stats"),
          icons: admin("tabs.icons"),
        }}
        usersContent={
          <>
            <AdminUserFilters
              admin={admin}
              searchInputValue={searchInputValue}
              onSearchChange={setSearchInputValue}
              usersParams={usersParams}
              planType={selectedPlanType}
              onRoleChange={onRoleChange}
              onSubscriptionStatusChange={onSubscriptionStatusChange}
              onAccountStatusChange={onAccountStatusChange}
              onPlanTypeChange={onPlanTypeChange}
            />

            <div className="overflow-x-clip" style={{ containIntrinsicSize: "1200px" }}>
              <AdminTablesSection
                usersParams={usersParams}
                planType={selectedPlanType}
                enabled={canLoadAdminData}
                visibleColumns={visibleColumns}
                onToggleColumnVisibility={onToggleColumnVisibility}
                onUsersPageChange={onUsersPageChange}
              />
            </div>
          </>
        }
        statsContent={
          <div className="flex flex-col gap-6">
            <KPICards
              items={kpiCards.map((metric) => ({
                key: metric.key,
                label: admin(`kpis.${metric.key}`),
                value: metric.value,
                isCurrency: metric.key === "revenue",
              }))}
            />

            <AdminMetricsSection
              admin={admin}
              common={common}
              metricsParams={metricsParams}
              isRangePopoverOpen={isRangePopoverOpen}
              customRangeDraft={customRangeDraft}
              customRangeValue={customRangeValue}
              customRangeLabel={customRangeLabel}
              maxSelectableDate={maxSelectableDate}
              maxSelectableDateInput={maxSelectableDateInput}
              onGranularityChange={onGranularityChange}
              onRangePopoverOpenChange={onRangePopoverOpenChange}
              onCustomRangeInputChange={onCustomRangeInputChange}
              onCustomRangeChange={onCustomRangeChange}
              cancelCustomRangeDraft={cancelCustomRangeDraft}
              applyCustomRangeDraft={applyCustomRangeDraft}
              metricsQuery={metricsQuery}
            />
          </div>
        }
        iconsContent={
          <div className="overflow-x-clip" style={{ containIntrinsicSize: "1200px" }}>
            <AdminIconsSection />
          </div>
        }
      />
    </div>
  );
}
