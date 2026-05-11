import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminSelect } from "../AdminSelect";
import type { AdminUser } from "@/lib/api/backend";
import type {
    ConfirmActionModalLabels,
    EditUserDraft,
    EditUserModalLabels,
    PendingAction,
} from "@/types";

type EditUserModalProps = {
    open: boolean;
    user: AdminUser | null;
    draft: EditUserDraft;
    onDraftChange: (next: EditUserDraft) => void;
    onClose: () => void;
    onSubmit: () => void;
    isPending: boolean;
    labels: EditUserModalLabels;
};

type ConfirmActionModalProps = {
    pendingAction: PendingAction;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
    labels: ConfirmActionModalLabels;
};

export function EditUserModal({
    open,
    user,
    draft,
    onDraftChange,
    onClose,
    onSubmit,
    isPending,
    labels,
}: EditUserModalProps) {
    if (!open || !user) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
            <div className="ui-surface-panel w-full max-w-xl rounded-4xl p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="ui-section-header">{labels.title}</p>
                        <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground">{user.username}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{labels.subtitle}</p>
                    </div>
                    <span className="inline-flex rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {labels.accountStatus}: {user.accountStatus === "disabled" ? labels.disabled : labels.active}
                    </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {labels.username}
                        </label>
                        <Input
                            value={draft.username}
                            onChange={(event) => onDraftChange({ ...draft, username: event.currentTarget.value })}
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {labels.email}
                        </label>
                        <Input
                            value={draft.email}
                            onChange={(event) => onDraftChange({ ...draft, email: event.currentTarget.value })}
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid gap-2 sm:col-span-2">
                        <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {labels.role}
                        </label>
                        <AdminSelect
                            value={draft.role}
                            onChange={(value) => onDraftChange({ ...draft, role: value as EditUserDraft["role"] })}
                            ariaLabel={labels.role}
                            disabled={isPending}
                            options={[
                                { value: "admin", label: "admin" },
                                { value: "user", label: "user" },
                                { value: "pro", label: "pro" },
                            ]}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="ghost" className="rounded-full" onClick={onClose} disabled={isPending}>
                        {labels.cancel}
                    </Button>
                    <Button type="button" className="rounded-full" onClick={onSubmit} disabled={isPending}>
                        {isPending ? `${labels.save}...` : labels.save}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function ConfirmActionModal({
    pendingAction,
    onClose,
    onConfirm,
    isPending,
    labels,
}: ConfirmActionModalProps) {
    if (!pendingAction) {
        return null;
    }

    const isDelete = pendingAction.type === "delete";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm">
            <div className="ui-surface-panel w-full max-w-lg rounded-4xl p-5 sm:p-6">
                <p className="ui-section-header">{isDelete ? labels.deleteTitle : labels.disableTitle}</p>
                <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground">{pendingAction.user.username}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {isDelete ? labels.deleteBody : labels.disableBody}
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <Button type="button" variant="ghost" className="rounded-full" onClick={onClose} disabled={isPending}>
                        {labels.cancel}
                    </Button>
                    <Button
                        type="button"
                        variant={isDelete ? "destructive" : "default"}
                        className="rounded-full"
                        onClick={onConfirm}
                        disabled={isPending}
                    >
                        {isPending
                            ? `${isDelete ? labels.confirmDelete : labels.confirmDisable}...`
                            : isDelete
                                ? labels.confirmDelete
                                : labels.confirmDisable}
                    </Button>
                </div>
            </div>
        </div>
    );
}
