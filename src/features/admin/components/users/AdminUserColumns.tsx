"use client";

import type { AdminColumnDef } from "@/types/admin";
import type {
  AdminPlanType,
  AdminSubscription,
} from "@/lib/api/backend";
import { UserEntity } from "@/features/user/models/UserEntity";
import type { MutationState, PendingAction } from "@/types";
import { AdminTableRowActions } from "./AdminTableRowActions";

interface GetUserColumnsParams {
  admin: (key: string) => string;
  common: (key: string) => string;
  formatDate: (rawDate?: string | null) => string;
  subscriptionByEmail: Map<string, AdminSubscription>;
  planByEmail: Map<string, AdminPlanType>;
  currentUserId?: string;
  openEditModal: (user: UserEntity) => void;
  setPendingAction: (action: PendingAction) => void;
  reEnableMutation: MutationState<string>;
  disableMutation: MutationState<string>;
  deleteMutation: MutationState<string>;
  updateMutationIsPending: boolean;
  editingUser: UserEntity | null;
  pendingAction: PendingAction;
  isDisabledAccountsView: boolean;
}

export function getAdminUserColumns({
  admin,
  common,
  formatDate,
  subscriptionByEmail,
  planByEmail,
  currentUserId,
  openEditModal,
  setPendingAction,
  reEnableMutation,
  disableMutation,
  deleteMutation,
  updateMutationIsPending,
  editingUser,
  pendingAction,
  isDisabledAccountsView,
}: GetUserColumnsParams): AdminColumnDef<UserEntity>[] {
  return [
    {
      id: "username",
      header: admin("table.users.username"),
      className: "font-medium text-foreground",
      cell: (user) => user.displayName,
    },
    {
      id: "email",
      header: admin("table.users.email"),
      className: "text-muted-foreground",
      cell: (user) => user.email,
    },
    {
      id: "role",
      header: admin("table.users.role"),
      cell: (user) => admin(`roles.${user.role}`),
    },
    {
      id: "accountStatus",
      header: admin("table.users.accountStatus"),
      cell: (user) => {
        const accountStatus = user.raw.accountStatus === "disabled" ? "disabled" : "active";
        return (
          <div className="inline-flex min-w-0 items-center gap-2">
            <span className={`size-2 rounded-full ${accountStatus === "disabled" ? "bg-amber-300/85" : "bg-emerald-300/85"}`} />
            <span className={`text-sm ${accountStatus === "disabled" ? "text-amber-100/90" : "text-foreground/88"}`}>
              {admin(`accountStatuses.${accountStatus}`)}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: admin("table.users.status"),
      cell: (user) => admin(`statuses.${user.raw.subscriptionStatus}`),
    },
    {
      id: "plan",
      header: admin("table.subscriptions.plan"),
      cell: (user) => {
        const resolvedPlan = planByEmail.get(user.email) ?? (user.role === "pro" ? "pro" : undefined);
        return (
          <span className="inline-flex rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]">
            {resolvedPlan ?? "-"}
          </span>
        );
      },
    },
    {
      id: "startDate",
      header: admin("table.users.startDate"),
      className: "text-muted-foreground",
      cell: (user) => {
        const subscription = subscriptionByEmail.get(user.email);
        return formatDate(subscription?.start_date);
      },
    },
    {
      id: "tokenExpiry",
      header: admin("table.users.tokenExpiry"),
      className: "text-muted-foreground",
      cell: (user) => {
        const subscription = subscriptionByEmail.get(user.email);
        const subscriptionFinishDate = user.raw.token_finish_date ?? subscription?.finish_date;
        return formatDate(subscriptionFinishDate);
      },
    },
    {
      id: "actions",
      header: admin("table.users.actions"), // Placeholder if missing
      isStickyRight: true,
      cell: (user) => {
        const accountStatus = user.raw.accountStatus === "disabled" ? "disabled" : "active";
        return (
          <AdminTableRowActions
            item={user}
            currentUserId={currentUserId}
            accountStatus={accountStatus}
            common={common}
            admin={admin}
            openEditModal={openEditModal}
            setPendingAction={setPendingAction}
            reEnableMutation={reEnableMutation}
            disableMutation={disableMutation}
            deleteMutation={deleteMutation}
            updateMutationIsPending={updateMutationIsPending}
            editingUser={editingUser}
            pendingAction={pendingAction}
            isDisabledAccountsView={isDisabledAccountsView}
          />
        );
      },
    },
  ];
}

