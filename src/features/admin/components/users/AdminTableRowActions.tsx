import { PencilLine, RotateCcw, Trash2, UserRoundX } from "lucide-react";
import type { AdminUser } from "@/lib/api/backend";
import type { MutationState, PendingAction } from "@/types";
import { ActionIconButton } from "../AdminTableActionButton";

export interface AdminTableRowActionsProps {
    item: AdminUser;
    currentUserId?: string;
    accountStatus: "active" | "disabled";
    common: (key: string) => string;
    admin: (key: string) => string;
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

export function AdminTableRowActions({
    item,
    currentUserId,
    accountStatus,
    common,
    admin,
    openEditModal,
    setPendingAction,
    reEnableMutation,
    disableMutation,
    deleteMutation,
    updateMutationIsPending,
    editingUser,
    pendingAction,
    isDisabledAccountsView,
}: AdminTableRowActionsProps) {
    const isSelf = currentUserId === item.id;
    const isMutatingRow =
        (updateMutationIsPending && editingUser?.id === item.id) ||
        (reEnableMutation.isPending && reEnableMutation.variables === item.id) ||
        (disableMutation.isPending && pendingAction?.type === "disable" && pendingAction.user.id === item.id) ||
        (deleteMutation.isPending && pendingAction?.type === "delete" && pendingAction.user.id === item.id);

    return (
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
    );
}
