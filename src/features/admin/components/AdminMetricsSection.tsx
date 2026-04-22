import type { DateRange } from "react-day-picker";
import type { AdminMetricsTimeseriesPoint } from "@/lib/api/backend";
import { AdminMetricsFilters } from "./AdminMetricsFilters";
import { MetricsCharts } from "./MetricsCharts";

function PlaceholderBlock({ className }: { className?: string }) {
    return <div className={`rounded-2xl bg-muted/70 ${className ?? ""}`} />;
}

interface AdminMetricsSectionProps {
    admin: (key: string) => string;
    common: (key: string) => string;
    metricsParams: { granularity?: string };
    isRangePopoverOpen: boolean;
    customRangeDraft?: DateRange;
    customRangeValue?: DateRange;
    customRangeLabel: string;
    maxSelectableDate: Date;
    maxSelectableDateInput: string;
    onGranularityChange: (granularity: string) => void;
    onRangePopoverOpenChange: (open: boolean) => void;
    onCustomRangeInputChange: (field: "from" | "to", rawValue: string) => void;
    onCustomRangeChange: (range: DateRange | undefined) => void;
    cancelCustomRangeDraft: () => void;
    applyCustomRangeDraft: () => void;
    metricsQuery: {
        state: string;
        data?: {
            data?: {
                timeseries?: AdminMetricsTimeseriesPoint[];
            };
        };
    };
}

export function AdminMetricsSection({
    admin,
    common,
    metricsParams,
    isRangePopoverOpen,
    customRangeDraft,
    customRangeValue,
    customRangeLabel,
    maxSelectableDate,
    maxSelectableDateInput,
    onGranularityChange,
    onRangePopoverOpenChange,
    onCustomRangeInputChange,
    onCustomRangeChange,
    cancelCustomRangeDraft,
    applyCustomRangeDraft,
    metricsQuery,
}: AdminMetricsSectionProps) {
    return (
        <section
            className="ui-surface-panel rounded-[1.85rem] p-4 sm:p-5"
            style={{ contentVisibility: "auto", containIntrinsicSize: "360px" }}
        >
            <div className="flex flex-col gap-4">
                <div>
                    <p className="ui-section-header">{admin("kpis.salesCount")} / {admin("kpis.revenue")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{admin("chartDescription")}</p>
                </div>

                <AdminMetricsFilters
                    admin={admin}
                    common={common}
                    metricsParams={metricsParams}
                    isRangePopoverOpen={isRangePopoverOpen}
                    customRangeDraft={customRangeDraft}
                    customRangeValue={customRangeValue}
                    customRangeLabel={customRangeLabel}
                    maxSelectableDate={maxSelectableDate}
                    maxSelectableDateInput={maxSelectableDateInput}
                    onGranularityChange={onGranularityChange}
                    onRangePopoverOpenChange={onRangePopoverOpenChange}
                    onCustomRangeInputChange={onCustomRangeInputChange}
                    onCustomRangeChange={onCustomRangeChange}
                    cancelCustomRangeDraft={cancelCustomRangeDraft}
                    applyCustomRangeDraft={applyCustomRangeDraft}
                />
            </div>

            <div className="mt-5 min-h-88 min-w-0 overflow-x-clip">
                {metricsQuery.state === "loading" && <PlaceholderBlock className="h-72 w-full" />}
                {metricsQuery.state === "error" && <p className="text-sm text-destructive">{admin("errors.loadMetrics")}</p>}
                {metricsQuery.state === "empty" && <p className="text-sm text-muted-foreground">{admin("states.emptyMetrics")}</p>}

                {metricsQuery.state === "success" && (
                    <MetricsCharts points={metricsQuery.data?.data?.timeseries ?? []} />
                )}
            </div>
        </section>
    );
}
