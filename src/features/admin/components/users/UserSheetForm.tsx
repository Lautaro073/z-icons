import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { AdminSelect } from "../shared/AdminSelect";
import { UserEntity } from "@/features/user/models/UserEntity";
import type { EditUserDraft, EditUserModalLabels } from "@/types";

export type UserSheetFormProps = {
    open: boolean;
    user: UserEntity | null;
    draft: EditUserDraft;
    onDraftChange: (next: EditUserDraft) => void;
    onClose: () => void;
    onSubmit: () => void;
    isPending: boolean;
    labels: EditUserModalLabels;
};

export function UserSheetForm({
    open,
    user,
    draft,
    onDraftChange,
    onClose,
    onSubmit,
    isPending,
    labels,
}: UserSheetFormProps) {
    if (!user) {
        return null;
    }

    return (
        <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <SheetContent className="flex flex-col p-0 sm:max-w-md w-full h-full max-h-screen overflow-hidden border-l border-border/40 bg-background/95 backdrop-blur-md">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-xl font-semibold text-foreground">
                        {labels.title}
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">
                                {labels.username}
                            </label>
                            <Input
                                value={draft.username}
                                onChange={(event) => onDraftChange({ ...draft, username: event.currentTarget.value })}
                                disabled={isPending}
                                className="bg-background/50 border-border/60 hover:border-border/80 focus:border-primary"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">
                                {labels.email}
                            </label>
                            <Input
                                value={draft.email}
                                onChange={(event) => onDraftChange({ ...draft, email: event.currentTarget.value })}
                                disabled={isPending}
                                className="bg-background/50 border-border/60 hover:border-border/80 focus:border-primary"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-foreground">
                                {labels.role}
                            </label>
                            <AdminSelect
                                value={draft.role}
                                onChange={(value) => onDraftChange({ ...draft, role: value as EditUserDraft["role"] })}
                                ariaLabel={labels.role}
                                disabled={isPending}
                                options={[
                                    { value: "", label: "Elegir rol" },
                                    { value: "admin", label: "admin" },
                                    { value: "user", label: "user" },
                                    { value: "pro", label: "pro" },
                                ]}
                            />
                        </div>

                        <div className="flex flex-row items-center justify-between rounded-xl border border-border/40 bg-card/30 p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium text-foreground">
                                    Cuenta Activa
                                </label>
                                <p className="text-[13px] text-muted-foreground">
                                    Habilitar el acceso del usuario
                                </p>
                            </div>
                            <Switch
                                checked={draft.accountStatus === "active"}
                                onCheckedChange={(checked) => onDraftChange({ ...draft, accountStatus: checked ? "active" : "disabled" })}
                                disabled={isPending}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-4 border-t border-border/40 bg-muted/10 mt-auto flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                        {labels.cancel}
                    </Button>
                    <Button type="button" onClick={onSubmit} disabled={isPending}>
                        {isPending ? `${labels.save}...` : labels.save}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
