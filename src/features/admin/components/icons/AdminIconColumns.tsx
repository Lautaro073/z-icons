"use client";

import type { AdminColumnDef } from "../../types/table.types";
import type { CustomIcon } from "@/features/admin/hooks/useCustomIcons";
import { ActionIconButton } from "../AdminTableActionButton";
import { Crown, PencilLine, Trash2 } from "lucide-react";

interface GetIconColumnsParams {
  admin: (key: string) => string;
  formatDate: (dateString: string) => string;
  getUserName: (icon: CustomIcon) => string;
  handleOpenEdit: (icon: CustomIcon) => void;
  setDeleteId: (id: string) => void;
}

export function getAdminIconColumns({
  admin,
  formatDate,
  getUserName,
  handleOpenEdit,
  setDeleteId,
}: GetIconColumnsParams): AdminColumnDef<CustomIcon>[] {
  return [
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
  ];
}
