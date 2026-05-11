import type { DateRange } from "react-day-picker";
import { metricGranularityOptions } from "@/features/admin/index";
import { AdminCustomRangePicker } from "./AdminCustomRangePicker";
import { AdminSelect } from "../AdminSelect";
import { ExportButton } from "../ExportButton";
import { getMetricsReportColumns } from "@/lib/reports/configs/metricsReportConfig";
import type { AdminMetricsTimeseriesPoint } from "@/lib/api/backend";

interface AdminMetricsFiltersProps {
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
    timeseriesData: AdminMetricsTimeseriesPoint[];
    isSuccess: boolean;
}

export function AdminMetricsFilters({
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
    timeseriesData,
    isSuccess,
}: AdminMetricsFiltersProps) {
    return (
        <section
            className="ui-surface-panel rounded-[1.85rem] p-4 sm:p-5"
            style={{ contentVisibility: "auto", containIntrinsicSize: "360px" }}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <p className="ui-section-header">{admin("kpis.salesCount")} / {admin("kpis.revenue")}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{admin("chartDescription")}</p>
                    </div>
                    {isSuccess && timeseriesData.length > 0 && (
                        <div className="shrink-0">
                            <ExportButton<AdminMetricsTimeseriesPoint>
                                data={timeseriesData}
                                columns={getMetricsReportColumns(
                                    (k) => {
                                        if (k === "period") return admin("filters.custom");
                                        if (k === "registrations") return admin("kpis.registrations");
                                        if (k === "sales") return admin("kpis.salesCount");
                                        if (k === "grossRevenue") return admin("kpis.revenue");
                                        if (k === "netRevenue") return admin("kpis.revenue") + " (Net)";
                                        return String(k);
                                    }
                                )}
                                filename={`z-icons-metricas-${new Date().toISOString().split('T')[0]}`}
                                reportTitle="Resumen de Métricas"
                                labels={{
                                    trigger: admin("export.trigger"),
                                    csv: admin("export.csv"),
                                    excel: admin("export.excel"),
                                    pdf: admin("export.pdf"),
                                    success: admin("export.success"),
                                    error: admin("export.error"),
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <AdminSelect
                        value={metricsParams.granularity ?? "day"}
                        onChange={onGranularityChange}
                        ariaLabel={admin("filters.granularity")}
                        options={metricGranularityOptions.map((option) => ({
                            value: option,
                            label: admin(`filters.${option}`),
                        }))}
                    />

                    {metricsParams.granularity === "custom" && (
                        <AdminCustomRangePicker
                            admin={admin}
                            common={common}
                            buttonLabel={customRangeLabel}
                            isOpen={isRangePopoverOpen}
                            selectedRange={customRangeDraft ?? customRangeValue}
                            maxSelectableDate={maxSelectableDate}
                            maxSelectableDateInput={maxSelectableDateInput}
                            onOpenChange={onRangePopoverOpenChange}
                            onInputChange={onCustomRangeInputChange}
                            onRangeChange={onCustomRangeChange}
                            onCancel={cancelCustomRangeDraft}
                            onApply={applyCustomRangeDraft}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
