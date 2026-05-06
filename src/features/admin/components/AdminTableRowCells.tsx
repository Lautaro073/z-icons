import type {
    AdminPlanType,
    AdminPreferenceColumnKey,
    AdminSubscription,
    AdminUser,
} from "@/lib/api/backend";
import type { MutationState, PendingAction } from "@/types";
import { AdminTableCell } from "./AdminTableCell";
import { AdminTableRowActions } from "./AdminTableRowActions";

export interface AdminTableRowCellsProps {
    item: AdminUser;
    currentUserId?: string;
    subscriptionByEmail: Map<string, AdminSubscription>;
    planByEmail: Map<string, AdminPlanType>;
    visibleColumns: Record<AdminPreferenceColumnKey, boolean>;
    admin: (key: string) => string;
    common: (key: string) => string;
    formatDate: (rawDate?: string | null) => string;
    openEditModal: (user: AdminUser) => void;
    setPendingAction: (action: PendingAction) => void;
    reEnableMutation: MutationState<string>;
    disableMutation: MutationState<string>;
    deleteMutation: MutationState<string>;
    updateMutationIsPending: boolean;
    editingUser: AdminUser | null;
    pendingAction: PendingAction;
    isDisabledAccountsView: boolean;
}

export function AdminTableRowCells({
    item,
    currentUserId,
    subscriptionByEmail,
    planByEmail,
    visibleColumns,
    admin,
    common,
    formatDate,
    openEditModal,
    setPendingAction,
    reEnableMutation,
    disableMutation,
    deleteMutation,
    updateMutationIsPending,
    editingUser,
    pendingAction,
    isDisabledAccountsView,
}: AdminTableRowCellsProps) {
    const subscription = subscriptionByEmail.get(item.email);
    const resolvedPlan = planByEmail.get(item.email) ?? (item.role_name === "pro" ? "pro" : undefined);
    const subscriptionStartDate = subscription?.start_date;
    const subscriptionFinishDate = item.token_finish_date ?? subscription?.finish_date;
    const accountStatus = item.accountStatus === "disabled" ? "disabled" : "active";

    return (
        <>
            {visibleColumns.username && <AdminTableCell className="font-medium text-foreground">{item.username}</AdminTableCell>}
            {visibleColumns.email && <AdminTableCell className="text-muted-foreground">{item.email}</AdminTableCell>}
            {visibleColumns.role && <AdminTableCell>{admin(`roles.${item.role_name}`)}</AdminTableCell>}
            {visibleColumns.accountStatus && (
                <AdminTableCell>
                    <div className="inline-flex min-w-0 items-center gap-2">
                        <span className={`size-2 rounded-full ${accountStatus === "disabled" ? "bg-amber-300/85" : "bg-emerald-300/85"}`} />
                        <span className={`text-sm ${accountStatus === "disabled" ? "text-amber-100/90" : "text-foreground/88"}`}>
                            {admin(`accountStatuses.${accountStatus}`)}
                        </span>
                    </div>
                </AdminTableCell>
            )}
            {visibleColumns.status && <AdminTableCell>{admin(`statuses.${item.subscriptionStatus}`)}</AdminTableCell>}
            {visibleColumns.plan && (
                <AdminTableCell>
                    <span className="inline-flex rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]">
                        {resolvedPlan ?? "-"}
                    </span>
                </AdminTableCell>
            )}
            {visibleColumns.startDate && (
                <AdminTableCell className="text-muted-foreground">{formatDate(subscriptionStartDate)}</AdminTableCell>
            )}
            {visibleColumns.tokenExpiry && (
                <AdminTableCell className="text-muted-foreground">{formatDate(subscriptionFinishDate)}</AdminTableCell>
            )}
            <AdminTableCell className="sticky right-0 relative p-0">
                <div className="absolute inset-0 -z-20 bg-background" />
                <div className="absolute inset-0 -z-10 bg-surface transition-colors duration-150 group-hover:bg-muted/16" />
                <div className="relative z-10 flex items-center justify-end px-3 py-3">
                    <AdminTableRowActions
                        item={item}
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
                </div>
            </AdminTableCell>
        </>
    );
}
