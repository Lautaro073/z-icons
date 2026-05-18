"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type {
  AdminPlanType,
  GetAdminUsersParams,
  UpdateAdminUserPayload,
} from "@/lib/api/backend";
import { UserEntity } from "@/features/user/models/UserEntity";
import {
  BackendApiError,
  deleteAdminUserPermanently,
  disableAdminUser,
  getAdminUsers,
  reEnableAdminUser,
  updateAdminUser,
} from "@/lib/api/backend";
import type { EditUserDraft, PendingAction } from "@/types";
import {
  buildSubscriptionByEmailMap,
  mapSubscriptionStatusForPlanFilter,
  resolvePlanForUser,
  normalizeAccountStatus,
} from "../utils";
import { useAdminSubscriptions } from "./useAdminSubscriptions";
import { useAdminUsers } from "./useAdminUsers";

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof BackendApiError && error.message) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useAdminTables({
  usersParams,
  planType,
  enabled = true,
}: {
  usersParams: GetAdminUsersParams;
  planType?: AdminPlanType;
  enabled?: boolean;
}) {
  const admin = useTranslations("admin");
  const common = useTranslations("common");
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const locale = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().locale;
    } catch {
      return "en-US";
    }
  }, []);

  const isPlanFilterEnabled = Boolean(planType);
  const shouldLoadPlans = usersParams.subscriptionStatus !== "none" || isPlanFilterEnabled;
  const isDisabledAccountsView = usersParams.accountStatus === "disabled";

  const [editingUser, setEditingUser] = useState<UserEntity | null>(null);
  const [editDraft, setEditDraft] = useState<EditUserDraft>({ username: "", email: "", role: "user",accountStatus:"active"  });
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const columnOptions = useMemo(
    () => [
      { key: "username" as const, label: admin("table.users.username") },
      { key: "email" as const, label: admin("table.users.email") },
      { key: "role" as const, label: admin("table.users.role") },
      { key: "accountStatus" as const, label: admin("table.users.accountStatus") },
      { key: "status" as const, label: admin("table.users.status") },
      { key: "plan" as const, label: admin("table.subscriptions.plan") },
      { key: "startDate" as const, label: admin("table.users.startDate") },
      { key: "tokenExpiry" as const, label: admin("table.users.tokenExpiry") },
    ],
    [admin]
  );

  const visibleColumnCount = columnOptions.length;

  const usersQuery = useAdminUsers(usersParams, { keepPreviousData: true, enabled });
  const subscriptionsQuery = useAdminSubscriptions(
    {
      page: 1,
      pageSize: 100,
      status: mapSubscriptionStatusForPlanFilter(usersParams.subscriptionStatus),
      planType,
      expiringInDays: usersParams.expiringInDays ?? 7,
    },
    { enabled: enabled && shouldLoadPlans }
  );

  const invalidateUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const updateMutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateAdminUserPayload }) => updateAdminUser(userId, payload),
    onSuccess: async () => {
      await invalidateUsers();
      toast.success(admin("toasts.userUpdated"));
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, admin("errors.updateUser")));
    },
  });

  const disableMutation = useMutation({
    mutationFn: (userId: string) => disableAdminUser(userId),
    onSuccess: async () => {
      await invalidateUsers();
      toast.success(admin("toasts.userDisabled"));
      setPendingAction(null);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, admin("errors.disableUser")));
    },
  });

  const reEnableMutation = useMutation({
    mutationFn: (userId: string) => reEnableAdminUser(userId),
    onSuccess: async () => {
      await invalidateUsers();
      toast.success(admin("toasts.userReEnabled"));
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, admin("errors.reEnableUser")));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteAdminUserPermanently(userId),
    onSuccess: async () => {
      await invalidateUsers();
      toast.success(admin("toasts.userDeleted"));
      setPendingAction(null);
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, admin("errors.deleteUser")));
    },
  });

  const usersPagination = usersQuery.data?.pagination;
  const subscriptionByEmail = buildSubscriptionByEmailMap(subscriptionsQuery.data?.data);
  const planByEmail = new Map(
    Array.from(subscriptionByEmail.entries()).map(([email, subscription]) => [email, subscription.plan_type])
  );
  const usersRows: UserEntity[] = usersQuery.data?.data ?? [];

  const applyClientSideFilters = (rows: UserEntity[]) => {
    const accountVisible = rows.filter((item: UserEntity) => {
      const accountStatus = normalizeAccountStatus(item.raw.accountStatus);
      if (usersParams.accountStatus === "disabled") {
        return accountStatus === "disabled";
      }
      return accountStatus === "active";
    });

    return isPlanFilterEnabled
      ? accountVisible.filter((item: UserEntity) => resolvePlanForUser(item.raw, planByEmail) === planType)
      : accountVisible;
  };

  const filteredUsers = applyClientSideFilters(usersRows);

  /**
   * Fetch ALL users matching current search/filters for export purposes.
   * Concatenates all pages from the server using the maximum allowed pageSize (100).
   */
  const fetchAllUsers = async () => {
    try {
      const MAX_SERVER_PAGE_SIZE = 100;
      
      // Primer request para obtener la primera página y el conteo total de páginas
      const firstPageResult = await getAdminUsers({
        ...usersParams,
        page: 1,
        pageSize: MAX_SERVER_PAGE_SIZE,
      });

      let allData = [...firstPageResult.data];
      const totalPages = firstPageResult.pagination.totalPages;

      // Si hay más páginas, lanzamos peticiones concurrentes para el resto
      if (totalPages > 1) {
        const remainingPagePromises = [];
        for (let p = 2; p <= totalPages; p++) {
          remainingPagePromises.push(
            getAdminUsers({
              ...usersParams,
              page: p,
              pageSize: MAX_SERVER_PAGE_SIZE,
            })
          );
        }

        const otherPagesResults = await Promise.all(remainingPagePromises);
        otherPagesResults.forEach((res) => {
          allData = allData.concat(res.data);
        });
      }

      return applyClientSideFilters(allData);
    } catch (error) {
      console.error("Failed to fetch all users for export", error);
      toast.error(admin("errors.exportFetchFailed"));
      throw error;
    }
  };

  const isLoading = usersQuery.state === "loading" || (isPlanFilterEnabled && subscriptionsQuery.state === "loading");
  const isError = usersQuery.state === "error" || (isPlanFilterEnabled && subscriptionsQuery.state === "error");
  const isEmpty = !isLoading && !isError && filteredUsers.length === 0;

  const formatDate = (rawDate?: string | null) => {
    if (!rawDate) {
      return "-";
    }

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(locale);
  };

  const openEditModal = (user: UserEntity) => {
    setEditingUser(user);
    setEditDraft({
      username: user.displayName,
      email: user.email,
      role: user.role,
      accountStatus: user.raw.accountStatus === "disabled" ? "disabled" : "active",
    });
  };

  const submitEditModal = () => {
    if (!editingUser) {
      return;
    }

    const nextUsername = editDraft.username.trim();
    const nextEmail = editDraft.email.trim();
    const nextRole = editDraft.role;
    const nextAccountStatus = editDraft.accountStatus;
    
    const initialAccountStatus = editingUser.raw.accountStatus === "disabled" ? "disabled" : "active";

    const isProfileChanged = nextUsername !== editingUser.displayName || nextEmail !== editingUser.email || nextRole !== editingUser.role;
    const isStatusChanged = nextAccountStatus !== initialAccountStatus;

    if (!isProfileChanged && !isStatusChanged) {
      setEditingUser(null);
      return;
    }

    if (isStatusChanged) {
      if (nextAccountStatus === "disabled") {
        disableMutation.mutate(editingUser.id);
      } else {
        reEnableMutation.mutate(editingUser.id);
      }
    }

    if (isProfileChanged) {
      updateMutation.mutate({
        userId: editingUser.id,
        payload: {
          username: nextUsername,
          email: nextEmail,
          role: nextRole,
        },
      });
    } else if (isStatusChanged) {
      setEditingUser(null);
    }
  };

  const confirmPendingAction = () => {
    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === "disable") {
      disableMutation.mutate(pendingAction.user.id);
      return;
    }

    deleteMutation.mutate(pendingAction.user.id);
  };

  const modalLabels = {
    title: admin("dialogs.editUserTitle"),
    subtitle: admin("dialogs.editUserBody"),
    save: common("actions.update"),
    cancel: common("actions.cancel"),
    username: admin("table.users.username"),
    email: admin("table.users.email"),
    role: admin("table.users.role"),
    accountStatus: admin("table.users.accountStatus"),
    active: admin("accountStatuses.active"),
    disabled: admin("accountStatuses.disabled"),
  };

  const confirmLabels = {
    cancel: common("actions.cancel"),
    confirmDisable: admin("dialogs.confirmDisableCta"),
    confirmDelete: admin("dialogs.confirmDeleteCta"),
    disableTitle: admin("dialogs.disableTitle"),
    disableBody: admin("dialogs.disableBody"),
    deleteTitle: admin("dialogs.deleteTitle"),
    deleteBody: admin("dialogs.deleteBody"),
  };

  return {
    admin,
    common,
    currentUser,
    isPlanFilterEnabled,
    isDisabledAccountsView,
    filteredUsers,
    subscriptionByEmail,
    planByEmail,
    usersPagination,
    isLoading,
    isError,
    isEmpty,
    formatDate,
    columnOptions,
    visibleColumnCount,
    editingUser,
    setEditingUser,
    editDraft,
    setEditDraft,
    pendingAction,
    setPendingAction,
    openEditModal,
    submitEditModal,
    confirmPendingAction,
    updateMutation,
    disableMutation,
    reEnableMutation,
    deleteMutation,
    invalidateUsers,
    fetchAllUsers,
    modalLabels,
    confirmLabels,
  } as const;
}

