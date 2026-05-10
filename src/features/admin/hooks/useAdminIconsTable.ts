"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCustomIcons, type CustomIcon, type CustomIconPayload } from "./useCustomIcons";
import { useAdminUsers } from "./useAdminUsers";

export interface UseAdminIconsTableProps {
  itemsPerPage?: number;
}

export function useAdminIconsTable({ itemsPerPage = 7 }: UseAdminIconsTableProps = {}) {
  const admin = useTranslations("admin.customIcons");
  const common = useTranslations("common");

  const { icons, isLoading, isError, createIcon, createIconsBulk, updateIcon, deleteIcon } = useCustomIcons();
  
  const { data: usersData } = useAdminUsers({ pageSize: 100 });
  const users = useMemo(() => usersData?.data || [], [usersData?.data]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // UI States (Modals)
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<CustomIcon | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(icons.map(i => i.category).filter(Boolean))).sort();
  }, [icons]);

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

  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage) || 1;
  
  const paginatedIcons = useMemo(() => {
    return filteredIcons.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredIcons, currentPage, itemsPerPage]);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Sync pagination when total results shrink
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

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  }, []);

  const handleOpenCreate = useCallback(() => {
    setEditingIcon(null);
    setIsSheetOpen(true);
  }, []);

  const handleOpenEdit = useCallback((icon: CustomIcon) => {
    setEditingIcon(icon);
    setIsSheetOpen(true);
  }, []);

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

  return {
    // Config/Strings
    admin,
    common,
    // Data states
    icons,
    filteredIcons,
    paginatedIcons,
    isLoading,
    isError,
    // Pagination info
    currentPage,
    setCurrentPage,
    totalPages,
    hasPrev,
    hasNext,
    // List info for filters
    uniqueCreators,
    uniqueCategories,
    // Filter states
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
    // Modal states
    isSheetOpen,
    setIsSheetOpen,
    editingIcon,
    deleteId,
    setDeleteId,
    isSubmitting,
    // Actions & Helpers
    getUserName,
    formatDate,
    handleOpenCreate,
    handleOpenEdit,
    handleFormSubmit,
    confirmDelete,
  };
}
