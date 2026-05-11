"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearIconContentCache } from "@/features/icons-explorer";
import {
  getCustomIcons,
  createCustomIcon,
  createCustomIconsBulk,
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
    onSuccess: (newIcon) => {
      if (newIcon) {
        queryClient.setQueryData(["custom-icons"], (old: CustomIcon[] | undefined) => 
          old ? [newIcon, ...old] : [newIcon]
        );
      }
      queryClient.invalidateQueries({ queryKey: ["custom-icons"] });
      clearIconContentCache();
    },
  });

  const createBulkMutation = useMutation({
    mutationFn: createCustomIconsBulk,
    onSuccess: (newIcons) => {
      if (newIcons && newIcons.length > 0) {
        queryClient.setQueryData(["custom-icons"], (old: CustomIcon[] | undefined) => 
          old ? [...newIcons, ...old] : [...newIcons]
        );
      }
      queryClient.invalidateQueries({ queryKey: ["custom-icons"] });
      clearIconContentCache();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CustomIconPayload> }) => 
      updateCustomIcon(id, payload),
    onSuccess: (updatedIcon) => {
      if (updatedIcon) {
        queryClient.setQueryData(["custom-icons"], (old: CustomIcon[] | undefined) => 
          old ? old.map(icon => icon.id === updatedIcon.id ? updatedIcon : icon) : [updatedIcon]
        );
      }
      queryClient.invalidateQueries({ queryKey: ["custom-icons"] });
      clearIconContentCache();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomIcon,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["custom-icons"], (oldData: CustomIcon[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((icon) => icon.id !== deletedId);
      });
      
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
    createIconsBulk: createBulkMutation.mutateAsync,
    isCreating: createMutation.isPending || createBulkMutation.isPending,
    updateIcon: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteIcon: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
