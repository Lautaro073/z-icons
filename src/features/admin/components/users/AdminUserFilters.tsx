import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { AdminSelect } from "../shared/AdminSelect";

interface UserFiltersParams {
    role?: string;
    subscriptionStatus?: string;
    accountStatus?: string;
}

interface AdminUserFiltersProps {
    admin: (key: string) => string;
    searchInputValue: string;
    onSearchChange: (value: string) => void;
    usersParams: UserFiltersParams;
    planType?: string;
    onRoleChange: (value: string) => void;
    onSubscriptionStatusChange: (value: string) => void;
    onAccountStatusChange: (value: string) => void;
    onPlanTypeChange: (value: string) => void;
}

export function AdminUserFilters({
    admin,
    searchInputValue,
    onSearchChange,
    usersParams,
    planType,
    onRoleChange,
    onSubscriptionStatusChange,
    onAccountStatusChange,
    onPlanTypeChange,
}: AdminUserFiltersProps) {
    return (
        <section className="ui-surface-panel rounded-[1.85rem] p-4 sm:p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <Input
                    placeholder={admin("filters.search")}
                    value={searchInputValue}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.currentTarget.value)}
                />

                <AdminSelect
                    value={usersParams.role ?? ""}
                    onChange={onRoleChange}
                    ariaLabel={admin("filters.role")}
                    options={[
                        { value: "", label: admin("filters.allRoles") },
                        { value: "admin", label: admin("roles.admin") },
                        { value: "user", label: admin("roles.user") },
                        { value: "pro", label: admin("roles.pro") },
                    ]}
                />

                <AdminSelect
                    value={usersParams.subscriptionStatus ?? ""}
                    onChange={onSubscriptionStatusChange}
                    ariaLabel={admin("filters.subscriptionStatus")}
                    options={[
                        { value: "", label: admin("filters.allSubscriptionStatuses") },
                        { value: "active", label: admin("statuses.active") },
                        { value: "expiring", label: admin("statuses.expiring") },
                        { value: "expired", label: admin("statuses.expired") },
                        { value: "none", label: admin("statuses.none") },
                    ]}
                />

                <AdminSelect
                    value={usersParams.accountStatus ?? ""}
                    onChange={onAccountStatusChange}
                    ariaLabel={admin("filters.accountStatus")}
                    options={[
                        { value: "", label: admin("filters.allAccountStatuses") },
                        { value: "active", label: admin("accountStatuses.active") },
                        { value: "disabled", label: admin("accountStatuses.disabled") },
                    ]}
                />

                <AdminSelect
                    value={planType ?? ""}
                    onChange={onPlanTypeChange}
                    ariaLabel={admin("filters.planType")}
                    options={[
                        { value: "", label: admin("filters.allPlanTypes") },
                        { value: "pro", label: "PRO" },
                        { value: "enterprise", label: "ENTERPRISE" },
                    ]}
                />
            </div>
        </section>
    );
}
