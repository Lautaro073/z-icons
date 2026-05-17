"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { AdminMetricsTimeseriesPoint } from "@/lib/api/backend";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface MetricsChartsProps {
  points: AdminMetricsTimeseriesPoint[];
}

function useLocaleFormatters() {
  const locale = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().locale;
    } catch {
      return "en-US";
    }
  }, []);

  const formatCount = useMemo(
    () => (value: number) => new Intl.NumberFormat(locale).format(value),
    [locale]
  );

  const formatCurrency = useMemo(
    () =>
      (value: number) =>
        new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(value),
    [locale]
  );

  return { formatCount, formatCurrency };
}

/* ── Gráfica 1: Registros ─────────────────────────────────── */

export function RegistrationsChart({ points }: MetricsChartsProps) {
  const admin = useTranslations("admin");
  const { formatCount } = useLocaleFormatters();

  const chartData = useMemo(
    () =>
      points.map((point) => ({
        bucket: point.bucketKey,
        registrations: point.registrations,
      })),
    [points]
  );

  const chartConfig = {
    registrations: {
      label: admin("kpis.registrations"),
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  if (chartData.length === 0) return null;

  return (
    <ChartContainer config={chartConfig} className="h-[20rem] w-full min-w-0">
      <LineChart accessibilityLayer data={chartData} margin={{ top: 16, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="2 6" />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          axisLine={false}
          minTickGap={28}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          allowDecimals={false}
          tickFormatter={(value) => formatCount(Number(value))}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCount(Number(value))}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="registrations"
          stroke="var(--color-registrations)"
          strokeWidth={2.25}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

/* ── Gráfica 2: Suscripciones + Ingresos ──────────────────── */

export function RevenueChart({ points }: MetricsChartsProps) {
  const admin = useTranslations("admin");
  const { formatCount, formatCurrency } = useLocaleFormatters();

  const chartData = useMemo(
    () =>
      points.map((point) => ({
        bucket: point.bucketKey,
        salesCount: point.salesCount,
        revenue: point.grossRevenue / 100,
      })),
    [points]
  );

  const chartConfig = {
    salesCount: {
      label: admin("kpis.salesCount"),
      color: "var(--chart-2)",
    },
    revenue: {
      label: admin("kpis.revenue"),
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (chartData.length === 0) return null;

  return (
    <ChartContainer config={chartConfig} className="h-[20rem] w-full min-w-0">
      <LineChart accessibilityLayer data={chartData} margin={{ top: 16, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="2 6" />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          axisLine={false}
          minTickGap={28}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          allowDecimals={false}
          tickFormatter={(value) => formatCount(Number(value))}
        />
        <YAxis
          yAxisId="revenue"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={58}
          tickFormatter={(value) => formatCurrency(Number(value))}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                if (name === "revenue") {
                  return formatCurrency(Number(value));
                }
                return formatCount(Number(value));
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="salesCount"
          stroke="var(--color-salesCount)"
          strokeWidth={2.25}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2.75}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
