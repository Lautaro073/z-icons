import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
    ConfirmActionModalLabels,
    PendingAction,
} from "@/types";

export type ConfirmActionModalProps = {
    pendingAction: PendingAction;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
    labels: ConfirmActionModalLabels;
};

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
        <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="sm:max-w-[400px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isDelete ? labels.deleteTitle : labels.disableTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="block font-medium text-foreground mb-2">
                            {pendingAction.user.displayName}
                        </span>
                        {isDelete ? labels.deleteBody : labels.disableBody}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {labels.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isPending}
                        className={isDelete ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                    >
                        {isPending
                            ? `${isDelete ? labels.confirmDelete : labels.confirmDisable}...`
                            : isDelete
                                ? labels.confirmDelete
                                : labels.confirmDisable}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
