import type { AdminUser } from "@/lib/api/backend";
import { UserEntity } from "@/features/user/models/UserEntity";

export type PendingAction =
  | { type: "disable"; user: UserEntity }
  | { type: "delete"; user: UserEntity }
  | null;

export interface EditUserDraft {
  username: string;
  email: string;
  role: "admin" | "user" | "pro";
  accountStatus: "active" | "disabled";
}

export interface MutationState<TVariables = void> {
  isPending: boolean;
  mutate: (variables: TVariables) => void;
  variables?: TVariables;
}

export interface EditUserModalLabels {
  title: string;
  subtitle: string;
  save: string;
  cancel: string;
  username: string;
  email: string;
  role: string;
  accountStatus: string;
  active: string;
  disabled: string;
}

export interface ConfirmActionModalLabels {
  cancel: string;
  confirmDisable: string;
  confirmDelete: string;
  disableTitle: string;
  disableBody: string;
  deleteTitle: string;
  deleteBody: string;
}

