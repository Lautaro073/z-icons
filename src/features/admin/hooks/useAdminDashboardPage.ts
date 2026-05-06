import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminTab } from "@/features/admin/components/AdminDashboardTabs";
import {
  defaultVisibleColumns,
  type UserColumnKey,
  parseUsersParamsFromSearch,
  parseMetricsParamsFromSearch,
  useAdminPreferences,
  useAdminMetrics,
  setSearchParam,
  parseIsoToDate,
  toUtcRangeEnd,
  toUtcRangeStart,
  parseInputDateValue,
  toInputDateValue,
  startOfLocalDay,
  clampDateToMax,
  normalizeRangeWithMax,
} from "@/features/admin/index";
import { useLocale } from "@/hooks/useLocale";
import { usePathname, useRouter } from "@/i18n/navigation";

export function useAdminDashboardPage() {
  const router = useRouter();
  const { currentLocale } = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();

  const usersParams = useMemo(() => parseUsersParamsFromSearch(searchParams), [searchParams]);
  const metricsParams = useMemo(() => parseMetricsParamsFromSearch(searchParams), [searchParams]);
  const selectedPlanType = useMemo(() => {
    const rawPlanType = searchParams.get("planType");
    return rawPlanType === "pro" || rawPlanType === "enterprise"
      ? (rawPlanType as "pro" | "enterprise")
      : undefined;
  }, [searchParams]);

  const activeTab = useMemo<AdminTab>(() => {
    const rawTab = searchParams.get("tab");
    return rawTab === "stats" ? "stats" : rawTab === "icons" ? "icons" : "users";
  }, [searchParams]);

  const [isRangePopoverOpen, setIsRangePopoverOpen] = useState(false);
  const [customRangeDraft, setCustomRangeDraft] = useState<DateRange | undefined>(undefined);
  const [optimisticVisibleColumns, setOptimisticVisibleColumns] = useState<Record<UserColumnKey, boolean> | null>(null);
  const [searchInputValue, setSearchInputValue] = useState(usersParams.search ?? "");
  const maxSelectableDate = useMemo(() => startOfLocalDay(), []);
  const maxSelectableDateInput = useMemo(
    () => toInputDateValue(maxSelectableDate),
    [maxSelectableDate]
  );
  const canLoadAdminData = !authLoading && isAuthenticated && user?.role_name === "admin";
  const preferencesQuery = useAdminPreferences({ enabled: canLoadAdminData });

  const persistedVisibleColumns = useMemo<Record<UserColumnKey, boolean>>(() => {
    const incomingVisibility = preferencesQuery.data?.data.columnVisibility;
    if (!incomingVisibility) {
      return defaultVisibleColumns;
    }

    const allowedKeys = Object.keys(defaultVisibleColumns) as UserColumnKey[];
    const normalized = allowedKeys.reduce<Record<UserColumnKey, boolean>>((acc, key) => {
      acc[key] = incomingVisibility[key] ?? defaultVisibleColumns[key];
      return acc;
    }, { ...defaultVisibleColumns });

    if (!Object.values(normalized).some(Boolean)) {
      return defaultVisibleColumns;
    }

    return normalized;
  }, [preferencesQuery.data]);

  const visibleColumns = optimisticVisibleColumns ?? persistedVisibleColumns;

  const customRangeValue = useMemo<DateRange | undefined>(() => {
    if (metricsParams.granularity !== "custom") {
      return undefined;
    }

    const from = parseIsoToDate(metricsParams.from);
    if (!from) {
      return undefined;
    }

    return {
      from,
      to: parseIsoToDate(metricsParams.to) ?? from,
    };
  }, [metricsParams.from, metricsParams.granularity, metricsParams.to]);

  const activeRangeForLabel = isRangePopoverOpen ? customRangeDraft ?? customRangeValue : customRangeValue;
  const admin = useTranslations("admin");
  const customRangeLabel = useMemo(() => {
    const fallbackLabel = `${admin("filters.from")} - ${admin("filters.to")}`;
    if (!activeRangeForLabel?.from) {
      return fallbackLabel;
    }

    const formatter = new Intl.DateTimeFormat(currentLocale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const fromLabel = formatter.format(activeRangeForLabel.from);
    const toLabel = formatter.format(activeRangeForLabel.to ?? activeRangeForLabel.from);
    return `${fromLabel} - ${toLabel}`;
  }, [activeRangeForLabel, admin, currentLocale]);

  const metricsQuery = useAdminMetrics(metricsParams, { enabled: canLoadAdminData });

  const updateUrl = useCallback(
    (
      updater: (params: URLSearchParams) => void,
      options?: { history?: "push" | "replace" }
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      updater(next);

      const localizedPathname =
        pathname === `/${currentLocale}` || pathname.startsWith(`/${currentLocale}/`)
          ? pathname
          : `/${currentLocale}${pathname === "/" ? "" : pathname}`;
      const queryString = next.toString();
      const nextUrl = queryString ? `${localizedPathname}?${queryString}` : localizedPathname;

      if (options?.history === "push") {
        window.history.pushState(null, "", nextUrl);
      } else {
        window.history.replaceState(null, "", nextUrl);
      }
    },
    [currentLocale, pathname, searchParams]
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/auth/login?session=expired");
      return;
    }

    if (user?.role_name && user.role_name !== "admin") {
      router.replace("/icons");
    }
  }, [authLoading, isAuthenticated, router, user?.role_name]);

  const onGranularityChange = useCallback((granularity: string) => {
    updateUrl((params) => {
      setSearchParam(params, "granularity", granularity);
      if (granularity === "custom") {
        const hasFrom = Boolean(params.get("from"));
        const hasTo = Boolean(params.get("to"));
        if (!hasFrom || !hasTo) {
          const today = new Date();
          setSearchParam(params, "from", toUtcRangeStart(today));
          setSearchParam(params, "to", toUtcRangeEnd(today));
        }
      } else {
        params.delete("from");
        params.delete("to");
      }
    });
  }, [updateUrl]);

  const onCustomRangeChange = useCallback((range: DateRange | undefined) => {
    setCustomRangeDraft(normalizeRangeWithMax(range, maxSelectableDate));
  }, [maxSelectableDate]);

  const onCustomRangeInputChange = useCallback((field: "from" | "to", rawValue: string) => {
    const parsedDate = parseInputDateValue(rawValue);
    const normalizedDate = parsedDate
      ? clampDateToMax(parsedDate, maxSelectableDate)
      : undefined;

    setCustomRangeDraft((currentDraft) => {
      const baseRange = currentDraft ?? customRangeValue;
      const baseFrom = baseRange?.from;
      const baseTo = baseRange?.to ?? baseRange?.from;

      if (field === "from") {
        if (!normalizedDate) {
          return baseTo ? { from: baseTo, to: baseTo } : undefined;
        }

        if (!baseTo) {
          return { from: normalizedDate, to: normalizedDate };
        }

        if (normalizedDate <= baseTo) {
          return { from: normalizedDate, to: baseTo };
        }

        return { from: normalizedDate, to: normalizedDate };
      }

      if (!normalizedDate) {
        return baseFrom ? { from: baseFrom, to: baseFrom } : undefined;
      }

      if (!baseFrom) {
        return { from: normalizedDate, to: normalizedDate };
      }

      if (normalizedDate >= baseFrom) {
        return { from: baseFrom, to: normalizedDate };
      }

      return { from: normalizedDate, to: baseFrom };
    });
  }, [customRangeValue, maxSelectableDate]);

  const onRangePopoverOpenChange = useCallback((open: boolean) => {
    setIsRangePopoverOpen(open);

    setCustomRangeDraft(normalizeRangeWithMax(customRangeValue, maxSelectableDate));
  }, [customRangeValue, maxSelectableDate]);

  const cancelCustomRangeDraft = useCallback(() => {
    setCustomRangeDraft(normalizeRangeWithMax(customRangeValue, maxSelectableDate));
    setIsRangePopoverOpen(false);
  }, [customRangeValue, maxSelectableDate]);

  const applyCustomRangeDraft = useCallback(() => {
    const normalizedDraft = normalizeRangeWithMax(customRangeDraft, maxSelectableDate);

    if (metricsParams.granularity !== "custom" || !normalizedDraft?.from) {
      setIsRangePopoverOpen(false);
      return;
    }

    const nextFrom = toUtcRangeStart(normalizedDraft.from);
    const nextTo = toUtcRangeEnd(normalizedDraft.to ?? normalizedDraft.from);

    if (metricsParams.from === nextFrom && metricsParams.to === nextTo) {
      setIsRangePopoverOpen(false);
      return;
    }

    updateUrl((params) => {
      setSearchParam(params, "from", nextFrom);
      setSearchParam(params, "to", nextTo);
    });

    setIsRangePopoverOpen(false);
  }, [customRangeDraft, maxSelectableDate, metricsParams.from, metricsParams.granularity, metricsParams.to, updateUrl]);

  const onRoleChange = useCallback(
    (role: string) => {
      updateUrl((params) => {
        setSearchParam(params, "role", role || undefined);
        setSearchParam(params, "usersPage", 1);
      });
    },
    [updateUrl]
  );

  const onSubscriptionStatusChange = useCallback(
    (subscriptionStatus: string) => {
      updateUrl((params) => {
        setSearchParam(params, "subscriptionStatus", subscriptionStatus || undefined);
        setSearchParam(params, "usersPage", 1);
      });
    },
    [updateUrl]
  );

  const onAccountStatusChange = useCallback(
    (accountStatus: string) => {
      updateUrl((params) => {
        setSearchParam(params, "accountStatus", accountStatus || undefined);
        setSearchParam(params, "usersPage", 1);
      });
    },
    [updateUrl]
  );

  const onPlanTypeChange = useCallback(
    (planType: string) => {
      updateUrl((params) => {
        setSearchParam(params, "planType", planType || undefined);
        setSearchParam(params, "usersPage", 1);
      });
    },
    [updateUrl]
  );

  const onTabChange = useCallback(
    (tab: AdminTab) => {
      updateUrl((params) => {
        setSearchParam(params, "tab", tab === "users" ? undefined : tab);
      });
    },
    [updateUrl]
  );

  const onUsersPageChange = useCallback(
    (page: number) => {
      updateUrl(
        (params) => setSearchParam(params, "usersPage", Math.max(1, page)),
        { history: "push" }
      );
    },
    [updateUrl]
  );

  useEffect(() => {
    const trimmedValue = searchInputValue.trim();
    const nextSearch = trimmedValue || undefined;

    if ((usersParams.search ?? undefined) === nextSearch) {
      return;
    }

    updateUrl((params) => {
      setSearchParam(params, "search", nextSearch);
      setSearchParam(params, "usersPage", 1);
    });
  }, [searchInputValue, updateUrl, usersParams.search]);

  const onToggleColumnVisibility = useCallback((key: UserColumnKey) => {
    if (!canLoadAdminData) {
      return;
    }

    const currentVisibleCount = Object.values(visibleColumns).filter(Boolean).length;
    if (visibleColumns[key] && currentVisibleCount === 1) {
      return;
    }

    const next = {
      ...visibleColumns,
      [key]: !visibleColumns[key],
    };

    setOptimisticVisibleColumns(next);
    void preferencesQuery
      .savePreferences({
        columnVisibility: {
          [key]: next[key],
        },
      })
      .catch(() => {
        setOptimisticVisibleColumns(null);
      });
  }, [canLoadAdminData, preferencesQuery, visibleColumns]);

  const kpiCards = [
    { key: "registrations", value: metricsQuery.data?.data.kpis.registrations ?? null },
    { key: "salesCount", value: metricsQuery.data?.data.kpis.salesCount ?? null },
    { key: "revenue", value: metricsQuery.data?.data.kpis.grossRevenue ?? null },
  ];

  return {
    activeTab,
    onTabChange,
    usersParams,
    metricsParams,
    selectedPlanType,
    isRangePopoverOpen,
    customRangeDraft,
    searchInputValue,
    setSearchInputValue,
    maxSelectableDate,
    maxSelectableDateInput,
    canLoadAdminData,
    visibleColumns,
    customRangeValue,
    customRangeLabel,
    metricsQuery,
    onGranularityChange,
    onCustomRangeChange,
    onCustomRangeInputChange,
    onRangePopoverOpenChange,
    cancelCustomRangeDraft,
    applyCustomRangeDraft,
    onRoleChange,
    onSubscriptionStatusChange,
    onAccountStatusChange,
    onPlanTypeChange,
    onUsersPageChange,
    onToggleColumnVisibility,
    kpiCards,
  };
}
