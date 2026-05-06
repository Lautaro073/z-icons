"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearIconContentCache } from "@/features/icons-explorer";
import {
  getCustomIcons,
  createCustomIcon,
  updateCustomIcon,
  deleteCustomIcon,
  type CustomIcon,
  type CustomIconPayload,
} from "@/lib/api/backend";

export type { CustomIcon, CustomIconPayload };

export function useCustomIcons() {
  const queryClient = useQueryClient();

  const iconsQuery = useQuery({
    queryKey: ["custom-icons"],
    queryFn: getCustomIcons,
  });

  const createMutation = useMutation({
    mutationFn: createCustomIcon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-icons"] });
      clearIconContentCache();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CustomIconPayload> }) => 
      updateCustomIcon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-icons"] });
      clearIconContentCache();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomIcon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-icons"] });
      clearIconContentCache();
    },
  });

  return {
    icons: Array.isArray(iconsQuery.data) ? iconsQuery.data : [],
    isLoading: iconsQuery.isLoading,
    isError: iconsQuery.isError,
    refetch: iconsQuery.refetch,
    createIcon: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateIcon: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteIcon: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
