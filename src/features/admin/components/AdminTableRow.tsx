import { PencilLine, RotateCcw, Trash2, UserRoundX } from "lucide-react";
import type {
    AdminPlanType,
    AdminPreferenceColumnKey,
    AdminSubscription,
    AdminUser,
} from "@/lib/api/backend";
import type { MutationState, PendingAction } from "@/types";
import { ActionIconButton } from "./AdminTableActionButton";

export interface AdminTableRowProps {
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

export function AdminTableRow({
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
}: AdminTableRowProps) {
    const subscription = subscriptionByEmail.get(item.email);
    const resolvedPlan = planByEmail.get(item.email) ?? (item.role_name === "pro" ? "pro" : undefined);
    const subscriptionStartDate = subscription?.start_date;
    const subscriptionFinishDate = item.token_finish_date ?? subscription?.finish_date;
    const accountStatus = item.accountStatus === "disabled" ? "disabled" : "active";
    const isSelf = currentUserId === item.id;
    const isMutatingRow =
        (updateMutationIsPending && editingUser?.id === item.id) ||
        (reEnableMutation.isPending && reEnableMutation.variables === item.id) ||
        (disableMutation.isPending && pendingAction?.type === "disable" && pendingAction.user.id === item.id) ||
        (deleteMutation.isPending && pendingAction?.type === "delete" && pendingAction.user.id === item.id);

    return (
        <tr className="border-b border-border/40 transition-colors duration-150 hover:bg-muted/16">
            {visibleColumns.username && <td className="px-3 py-4 font-medium text-foreground">{item.username}</td>}
            {visibleColumns.email && <td className="px-3 py-4 text-muted-foreground">{item.email}</td>}
            {visibleColumns.role && <td className="px-3 py-4">{admin(`roles.${item.role_name}`)}</td>}
            {visibleColumns.accountStatus && (
                <td className="px-3 py-4">
                    <div className="inline-flex min-w-0 items-center gap-2">
                        <span className={`size-2 rounded-full ${accountStatus === "disabled" ? "bg-amber-300/85" : "bg-emerald-300/85"}`} />
                        <span className={`text-sm ${accountStatus === "disabled" ? "text-amber-100/90" : "text-foreground/88"}`}>
                            {admin(`accountStatuses.${accountStatus}`)}
                        </span>
                    </div>
                </td>
            )}
            {visibleColumns.status && <td className="px-3 py-4">{admin(`statuses.${item.subscriptionStatus}`)}</td>}
            {visibleColumns.plan && (
                <td className="px-3 py-4">
                    <span className="inline-flex rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em]">
                        {resolvedPlan ?? "-"}
                    </span>
                </td>
            )}
            {visibleColumns.startDate && (
                <td className="px-3 py-4 text-muted-foreground">{formatDate(subscriptionStartDate)}</td>
            )}
            {visibleColumns.tokenExpiry && (
                <td className="px-3 py-4 text-muted-foreground">{formatDate(subscriptionFinishDate)}</td>
            )}
            <td className="px-3 py-4">
                <div className="flex justify-end gap-1.5">
                    {accountStatus === "active" ? (
                        <>
                            <ActionIconButton
                                label={`${common("actions.update")} ${item.username}`}
                                onClick={() => openEditModal(item)}
                                disabled={isMutatingRow}
                            >
                                <PencilLine className="size-3.5" />
                            </ActionIconButton>
                            <ActionIconButton
                                label={isSelf ? admin("actions.selfProtected") : admin("actions.disable")}
                                onClick={() => setPendingAction({ type: "disable", user: item })}
                                disabled={isMutatingRow || isSelf}
                            >
                                <UserRoundX className="size-3.5" />
                            </ActionIconButton>
                        </>
                    ) : (
                        <>
                            {isDisabledAccountsView && (
                                <ActionIconButton
                                    label={admin("actions.reEnable")}
                                    onClick={() => reEnableMutation.mutate(item.id)}
                                    disabled={isMutatingRow}
                                >
                                    <RotateCcw className="size-3.5" />
                                </ActionIconButton>
                            )}
                            <ActionIconButton
                                label={isSelf ? admin("actions.selfProtected") : admin("actions.deletePermanent")}
                                onClick={() => setPendingAction({ type: "delete", user: item })}
                                disabled={isMutatingRow || isSelf}
                                destructive
                            >
                                <Trash2 className="size-3.5" />
                            </ActionIconButton>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
