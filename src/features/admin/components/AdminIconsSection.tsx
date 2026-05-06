"use client";

import { ZIcon } from "@zcorvus/z-icons/react";
import { Loader2, PencilLine, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionIconButton } from "./AdminTableActionButton";
import { AdminTablePagination } from "./AdminTablePagination";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCustomIcons, type CustomIcon, type CustomIconPayload } from "@/features/admin/hooks/useCustomIcons";
import { IconSheetForm } from "./IconSheetForm";
export function AdminIconsSection() {
  const admin = useTranslations("admin.customIcons");
  const common = useTranslations("common");
  const { icons, isLoading, isError, createIcon, updateIcon, deleteIcon } = useCustomIcons();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(icons.length / itemsPerPage) || 1;
  const paginatedIcons = icons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [icons.length, totalPages, currentPage]);

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

  const handleFormSubmit = async (data: CustomIconPayload) => {
    setIsSubmitting(true);
    try {
      if (editingIcon) {
        await updateIcon({ id: editingIcon.id, payload: data });
      } else {
        await createIcon(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      await deleteIcon(deleteId);
      setDeleteId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <ZIcon type="mina" name="danger-triangle" className="mb-4 size-8 text-destructive" />
        <p>{admin("toasts.error")}</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <section className="grid gap-4 overflow-x-clip">
        <article className="ui-surface-panel flex min-h-120 min-w-0 flex-col rounded-[1.85rem] p-4 sm:p-5 gap-4">
          {/* Header inside the panel */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{admin("iconsTitle")}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{admin("iconsDescription")}</p>
            </div>
            <Button onClick={handleOpenCreate} variant="secondary" className="gap-2 rounded-full px-5">
              <ZIcon type="mina" name="plus" className="size-4" />
              {admin("addIcon")}
            </Button>
          </div>

          {/* Table wrapper */}
          <div className="flex-1 min-h-120 min-w-0 mt-2 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/60 hover:bg-transparent">
                  <TableHead className="h-10 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-bold">{admin("columns.name")}</TableHead>
                  <TableHead className="w-16 h-10 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-bold">{admin("columns.svg")}</TableHead>
                  <TableHead className="h-10 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-bold">{admin("columns.category")}</TableHead>
                  <TableHead className="h-10 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-bold">{admin("columns.createdAt")}</TableHead>
                  <TableHead className="h-10 text-right text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-bold">{admin("columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        {common("states.loading")}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : icons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No hay íconos todavía.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedIcons.map((icon) => (
                    <TableRow key={icon.id} className="border-b border-border/40 transition-colors hover:bg-muted/12 group">
                      <TableCell className="py-3 font-semibold text-foreground text-sm">{icon.name}</TableCell>
                      <TableCell className="py-3">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background shadow-sm text-foreground" dangerouslySetInnerHTML={{ __html: icon.svg_content || "" }} />
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                          {icon.category}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">{formatDate(icon.created_at)}</TableCell>
                      <TableCell className="py-3 text-right p-0">
                        <div className="flex items-center justify-end gap-2 px-3">
                          <ActionIconButton label={admin("editIcon")} onClick={() => handleOpenEdit(icon)}>
                            <PencilLine className="size-3.5" />
                          </ActionIconButton>
                          <ActionIconButton label={admin("deleteIcon")} onClick={() => setDeleteId(icon.id)} destructive>
                            <Trash2 className="size-3.5" />
                          </ActionIconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {icons.length > 0 && (
            <AdminTablePagination
              usersPagination={{
                page: currentPage,
                totalPages: totalPages,
                hasPrev: hasPrev,
                hasNext: hasNext,
              }}
              common={common}
              onUsersPageChange={(newPage) => setCurrentPage(newPage)}
            />
          )}
        </article>

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
      </section>
    </TooltipProvider>
  );
}
