"use client";

import { ZIcon } from "@zcorvus/z-icons/react";
import { PencilLine, Trash2, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCustomIcons, type CustomIcon, type CustomIconPayload } from "@/features/admin/hooks/useCustomIcons";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { ActionIconButton } from "./AdminTableActionButton";
import { AdminDataTableBase } from "./AdminDataTableBase";
import type { AdminColumnDef } from "../types/table.types";
import { AdminSelect } from "./AdminSelect";
import { AdminTablesPlaceholder } from "./AdminTablesPlaceholder";
import { IconSheetForm } from "./IconSheetForm";

export function AdminIconsSection() {
  const admin = useTranslations("admin.customIcons");
  const common = useTranslations("common");
  
  const { icons, isLoading, isError, createIcon, createIconsBulk, updateIcon, deleteIcon } = useCustomIcons();
  
  const { data: usersData } = useAdminUsers({ pageSize: 100 });
  const users = useMemo(() => usersData?.data || [], [usersData?.data]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const uniqueCreators = useMemo(() => {
    const creatorIds = icons
      .map(i => i.created_by || i.create_by)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
      
    const uniqueIds = Array.from(new Set(creatorIds));
    
    return uniqueIds.map(id => {
      const found = users.find(u => u.id === id);
      return { id, name: found ? found.username : `ID: ${id.substring(0, 6)}` };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [icons, users]);

  const filteredIcons = useMemo(() => {
    const now = new Date();
    
    return icons.filter((icon) => {
      const matchesSearch = searchQuery
        ? icon.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const isPrem = icon.is_premium === true || icon.is_premium === 1 || String(icon.is_premium) === "true";
      const matchesTier = selectedTier === "all" ? true : (selectedTier === "premium" ? isPrem : !isPrem);
      
      const matchesCategory = selectedCategory === "all" ? true : icon.category === selectedCategory;

      const cId = icon.created_by || icon.create_by;
      const actualCreatorId = cId || "Admin"; 
      const matchesCreator = selectedCreator === "all" ? true : actualCreatorId === selectedCreator;

      let matchesDate = true;
      if (selectedDateRange !== "all" && icon.created_at) {
        const createDate = new Date(icon.created_at);
        const diffTime = Math.abs(now.getTime() - createDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (selectedDateRange === "today") {
          matchesDate = createDate.toDateString() === now.toDateString();
        } else if (selectedDateRange === "week") {
          matchesDate = diffDays <= 7;
        } else if (selectedDateRange === "month") {
          matchesDate = diffDays <= 30;
        }
      }
      
      return matchesSearch && matchesTier && matchesCategory && matchesCreator && matchesDate;
    });
  }, [icons, searchQuery, selectedTier, selectedCategory, selectedCreator, selectedDateRange]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(icons.map(i => i.category).filter(Boolean))).sort();
  }, [icons]);

  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage) || 1;
  
  const paginatedIcons = useMemo(() => {
    return filteredIcons.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredIcons, currentPage, itemsPerPage]);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredIcons.length, totalPages, currentPage]);

  const getUserName = useCallback((icon: CustomIcon) => {
    const userId = icon.created_by || icon.create_by;
    if (!userId) return "Admin";
    const match = users.find((u) => u.id === userId);
    return match ? match.username : userId;
  }, [users]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<CustomIcon | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingIcon(null);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (icon: CustomIcon) => {
    setEditingIcon(icon);
    setIsSheetOpen(true);
  };

  const handleFormSubmit = async (data: CustomIconPayload | CustomIconPayload[]) => {
    setIsSubmitting(true);
    try {
      if (editingIcon) {
        const payload = Array.isArray(data) ? data[0] : data;
        if (!payload) throw new Error("Invalid payload");
        await updateIcon({ id: editingIcon.id, payload });
        toast.success(admin("toasts.updated"));
      } else {
        if (Array.isArray(data)) {
          await createIconsBulk(data);
          toast.success(admin("toasts.batchCreated", { count: data.length }));
        } else {
          await createIcon(data);
          toast.success(admin("toasts.created"));
        }
      }
      setIsSheetOpen(false);
    } catch {
      toast.error(admin("toasts.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      await deleteIcon(deleteId);
      toast.success(admin("toasts.deleted"));
      setDeleteId(null);
    } catch {
      toast.error(admin("toasts.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns = useMemo<AdminColumnDef<CustomIcon>[]>(() => [
    {
      id: "name",
      header: admin("columns.name"),
      cell: (icon) => <span className="font-semibold text-foreground text-sm">{icon.name}</span>,
    },
    {
      id: "svg",
      header: admin("columns.svg"),
      headerClassName: "w-16",
      cell: (icon) => (
        <div 
          className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-background shadow-sm text-foreground [&>svg]:size-6" 
          dangerouslySetInnerHTML={{ __html: icon.svg_content || "" }} 
        />
      ),
    },
    {
      id: "category",
      header: admin("columns.category"),
      cell: (icon) => (
        <span className="inline-flex rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          {icon.category}
        </span>
      ),
    },
    {
      id: "tier",
      header: admin("columns.tier"),
      cell: (icon) => {
        const isPrem = icon.is_premium === true || icon.is_premium === 1 || String(icon.is_premium) === "true";
        return isPrem ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-amber-600 dark:text-amber-400 whitespace-nowrap">
            <Crown className="size-3 fill-amber-500/20" />
            {admin("form.tierPremium")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
            {admin("form.tierFree")}
          </span>
        );
      },
    },
    {
      id: "createdBy",
      header: admin("columns.createdBy"),
      className: "text-sm text-muted-foreground font-medium",
      cell: (icon) => getUserName(icon),
    },
    {
      id: "createdAt",
      header: admin("columns.createdAt"),
      className: "text-sm text-muted-foreground",
      cell: (icon) => formatDate(icon.created_at),
    },
    {
      id: "actions",
      header: admin("columns.actions"),
      isStickyRight: true,
      cell: (icon) => (
        <div className="flex justify-end gap-1.5">
          <ActionIconButton label={admin("editIcon")} onClick={() => handleOpenEdit(icon)}>
            <PencilLine className="size-3.5" />
          </ActionIconButton>
          <ActionIconButton label={admin("deleteIcon")} onClick={() => setDeleteId(icon.id)} destructive>
            <Trash2 className="size-3.5" />
          </ActionIconButton>
        </div>
      ),
    },
  ], [admin, getUserName]);

  return (
    <TooltipProvider>
      <AdminDataTableBase<CustomIcon>
        data={paginatedIcons}
        columns={columns}
        title={admin("iconsTitle")}
        description={admin("iconsDescription")}
        headerActions={
          <Button onClick={handleOpenCreate} variant="secondary" className="gap-2 rounded-full px-5">
            <ZIcon type="mina" name="plus" className="size-4" />
            {admin("addIcon")}
          </Button>
        }
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: admin("filters.searchPlaceholder"),
        }}
        filters={
          <>
            <AdminSelect 
              value={selectedTier}
              onChange={setSelectedTier}
              ariaLabel={admin("filters.ariaTier")}
              options={[
                { value: "all", label: admin("form.tierAll") },
                { value: "free", label: admin("form.tierFree") },
                { value: "premium", label: admin("form.tierPremium") }
              ]}
            />
            <AdminSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              ariaLabel={admin("filters.ariaCategory")}
              options={[
                { value: "all", label: admin("filters.allCategories") },
                ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
              ]}
            />
            <AdminSelect
              value={selectedCreator}
              onChange={setSelectedCreator}
              ariaLabel={admin("filters.ariaCreator")}
              options={[
                { value: "all", label: admin("filters.allCreators") },
                ...uniqueCreators.map(c => ({ value: c.id, label: c.name }))
              ]}
            />
            <AdminSelect
              value={selectedDateRange}
              onChange={setSelectedDateRange}
              ariaLabel={admin("filters.ariaDate")}
              options={[
                { value: "all", label: admin("filters.anyDate") },
                { value: "today", label: admin("filters.today") },
                { value: "week", label: admin("filters.lastWeek") },
                { value: "month", label: admin("filters.lastMonth") },
              ]}
            />
          </>
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{admin("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{admin("deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>{admin("form.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {admin("deleteIcon")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
