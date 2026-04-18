"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type {
  AdminPreferenceColumnKey,
  AdminPlanType,
  AdminSubscription,
  AdminSubscriptionStatus,
  AdminUser,
  GetAdminUsersParams,
  UpdateAdminUserPayload,
} from "@/lib/api/backend";
import {
  BackendApiError,
  deleteAdminUserPermanently,
  disableAdminUser,
  reEnableAdminUser,
  updateAdminUser,
} from "@/lib/api/backend";
import { useAdminSubscriptions, useAdminUsers } from "@/features/admin";

type UserColumnKey = AdminPreferenceColumnKey;

type PendingAction =
  | { type: "disable"; user: AdminUser }
  | { type: "delete"; user: AdminUser }
  | null;

interface EditUserDraft {
  username: string;
  email: string;
  role: "admin" | "user" | "pro";
}

function buildSubscriptionByEmailMap(rows: AdminSubscription[] = []) {
  return new Map(rows.map((row) => [row.user_email, row]));
}

function mapSubscriptionStatusForPlanFilter(
  status?: AdminSubscriptionStatus
): Exclude<AdminSubscriptionStatus, "none"> | undefined {
  if (!status || status === "none") {
    return undefined;
  }

  return status;
}

function resolvePlanForUser(user: AdminUser, planByEmail: Map<string, AdminPlanType>): AdminPlanType | undefined {
  const planFromSubscription = planByEmail.get(user.email);
  if (planFromSubscription) {
    return planFromSubscription;
  }

  if (user.role_name === "pro") {
    return "pro";
  }

  return undefined;
}

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof BackendApiError && error.message) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function normalizeAccountStatus(status: AdminUser["accountStatus"] | undefined): "active" | "disabled" {
  return status === "disabled" ? "disabled" : "active";
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

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editDraft, setEditDraft] = useState<EditUserDraft>({ username: "", email: "", role: "user" });
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

  const visibleColumnCount = columnOptions.reduce((total, option) => total + 1, 0);

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
  const usersRows = usersQuery.data?.data ?? [];
  const accountVisibleUsers = usersRows.filter((item) => {
    const accountStatus = normalizeAccountStatus(item.accountStatus);

    if (usersParams.accountStatus === "disabled") {
      return accountStatus === "disabled";
    }

    return accountStatus === "active";
  });
  const filteredUsers = isPlanFilterEnabled
    ? accountVisibleUsers.filter((item) => resolvePlanForUser(item, planByEmail) === planType)
    : accountVisibleUsers;

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

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditDraft({
      username: user.username,
      email: user.email,
      role: user.role_name,
    });
  };

  const submitEditModal = () => {
    if (!editingUser) {
      return;
    }

    const nextUsername = editDraft.username.trim();
    const nextEmail = editDraft.email.trim();
    const nextRole = editDraft.role;

    if (nextUsername === editingUser.username && nextEmail === editingUser.email && nextRole === editingUser.role_name) {
      setEditingUser(null);
      return;
    }

    updateMutation.mutate({
      userId: editingUser.id,
      payload: {
        username: nextUsername,
        email: nextEmail,
        role: nextRole,
      },
    });
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
    modalLabels,
    confirmLabels,
  } as const;
}
