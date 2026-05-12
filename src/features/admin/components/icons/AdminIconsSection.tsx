"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ZIcon } from "@zcorvus/z-icons/react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminDataTableBase } from "../shared/AdminDataTableBase";
import { IconEntity } from "@/features/icons-explorer/models/IconEntity";
import type { AdminColumnDef } from "@/types/admin";
import { AdminTablesPlaceholder } from "../shared/AdminTablesPlaceholder";
import { IconSheetForm } from "./IconSheetForm";
import { AdminIconFilters } from "./AdminIconFilters";
import { DeleteIconModal } from "./AdminIconsModals";
import { getAdminIconColumns } from "./AdminIconColumns";
import { useAdminIconsTable } from "@/features/admin/hooks/useAdminIconsTable";
import { ExportButton } from "../shared/ExportButton";
import { getIconsReportColumns } from "@/features/admin/reports/iconsReportConfig";

interface AdminIconsSectionProps {
  itemsPerPage?: number;
}

export function AdminIconsSection({ itemsPerPage = 6 }: AdminIconsSectionProps) {
  const tRoot = useTranslations("admin");
  const {
    admin,
    common,
    icons,
    filteredIcons,
    paginatedIcons,
    isLoading,
    isError,
    currentPage,
    setCurrentPage,
    totalPages,
    hasPrev,
    hasNext,
    uniqueCreators,
    uniqueCategories,
    searchQuery,
    setSearchQuery,
    selectedTier,
    setSelectedTier,
    selectedCategory,
    setSelectedCategory,
    selectedCreator,
    setSelectedCreator,
    selectedDateRange,
    setSelectedDateRange,
    isSheetOpen,
    setIsSheetOpen,
    editingIcon,
    deleteId,
    setDeleteId,
    isSubmitting,
    getUserName,
    formatDate,
    handleOpenCreate,
    handleOpenEdit,
    handleFormSubmit,
    confirmDelete,
  } = useAdminIconsTable({ itemsPerPage });

  const columns = useMemo<AdminColumnDef<IconEntity>[]>(() => 
    getAdminIconColumns({
      admin,
      formatDate,
      getUserName,
      handleOpenEdit,
      setDeleteId
    }), 
    [admin, formatDate, getUserName, handleOpenEdit, setDeleteId]
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        <AdminIconFilters
          admin={admin}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCreator={selectedCreator}
          onCreatorChange={setSelectedCreator}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          uniqueCategories={uniqueCategories}
          uniqueCreators={uniqueCreators}
        />

        <AdminDataTableBase<IconEntity>
          data={paginatedIcons}
          columns={columns}
          title={admin("iconsTitle")}
          description={admin("iconsDescription")}
          headerActions={
            <div className="flex items-center gap-3">
              {!isLoading && !isError && filteredIcons.length > 0 && (
                <ExportButton<IconEntity>
                  data={filteredIcons}
                  columns={getIconsReportColumns(
                    (k) => {
                      if (k === "name") return admin("columns.name");
                      if (k === "category") return admin("columns.category");
                      if (k === "status") return admin("columns.status");
                      if (k === "creator") return admin("columns.createdBy");
                      if (k === "createdAt") return admin("columns.createdAt");
                      if (k === "is_premium") return admin("columns.tier");
                      if (k === "premium") return admin("form.tierPremium");
                      if (k === "free") return admin("form.tierFree");
                      return String(k);
                    },
                    getUserName,
                    formatDate
                  )}
                  filename={`z-icons-custom-${new Date().toISOString().split('T')[0]}`}
                  reportTitle={tRoot("export.iconsTitle")}
                  labels={{
                    trigger: tRoot("export.trigger"),
                    csv: tRoot("export.csv"),
                    excel: tRoot("export.excel"),
                    pdf: tRoot("export.pdf"),
                    success: tRoot("export.success"),
                    error: tRoot("export.error"),
                  }}
                />
              )}
              <Button onClick={handleOpenCreate} variant="secondary" className="gap-2 rounded-full px-5">
                <ZIcon type="mina" name="plus" className="size-4" />
                {admin("addIcon")}
              </Button>
            </div>
          }
          isLoading={isLoading}
          isError={isError}
          isEmptyOverride={filteredIcons.length === 0 && !isLoading}
          loadingComponent={
            <AdminTablesPlaceholder type="loading" isPlanFilterEnabled={false} admin={admin} />
          }
          errorComponent={
            <div className="rounded-[1.25rem] border border-destructive/30 bg-destructive/5 p-6 text-center flex flex-col items-center justify-center gap-2">
              <ZIcon type="mina" name="danger-triangle" className="size-6 text-destructive mb-2" />
              <p className="text-sm text-destructive font-medium">{admin("toasts.error")}</p>
            </div>
          }
          emptyComponent={
            <div className="rounded-[1.25rem] border border-border/60 bg-muted/10 p-8 text-center flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground font-medium">
                {icons.length === 0 ? admin("states.emptyInitial") : admin("states.emptyFiltered")}
              </p>
            </div>
          }
          pagination={
            filteredIcons.length > 0
              ? {
                  page: currentPage,
                  totalPages: totalPages,
                  hasPrev: hasPrev,
                  hasNext: hasNext,
                }
              : null
          }
          common={common}
          onPageChange={setCurrentPage}
          tableMinWidthClassName="w-full text-left text-sm min-w-[900px]"
        />

        <IconSheetForm
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onSubmit={handleFormSubmit}
          defaultValues={editingIcon}
          isSubmitting={isSubmitting}
        />

        <DeleteIconModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          isSubmitting={isSubmitting}
          admin={admin}
        />
      </div>
    </TooltipProvider>
  );
}

