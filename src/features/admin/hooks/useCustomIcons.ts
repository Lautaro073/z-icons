"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clearIconContentCache } from "@/features/icons-explorer";
import { IconEntity } from "@/features/icons-explorer/models/IconEntity";
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
        const entity = new IconEntity(newIcon);
        queryClient.setQueryData(["custom-icons"], (old: IconEntity[] | undefined) => 
          old ? [entity, ...old] : [entity]
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
        const entities = newIcons.map(i => new IconEntity(i));
        queryClient.setQueryData(["custom-icons"], (old: IconEntity[] | undefined) => 
          old ? [...entities, ...old] : [...entities]
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
        const entity = new IconEntity(updatedIcon);
        queryClient.setQueryData(["custom-icons"], (old: IconEntity[] | undefined) => 
          old ? old.map(icon => icon.id === updatedIcon.id ? entity : icon) : [entity]
        );
      }
      queryClient.invalidateQueries({ queryKey: ["custom-icons"] });
      clearIconContentCache();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomIcon,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["custom-icons"], (oldData: IconEntity[] | undefined) => {
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

