import type { DateRange } from "react-day-picker";

export const metricGranularityOptions = ["day", "month", "year", "custom"] as const;

export function parseIsoToDate(rawIso?: string): Date | undefined {
  if (!rawIso) {
    return undefined;
  }

  const date = new Date(rawIso);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function toUtcRangeStart(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  ).toISOString();
}

export function toUtcRangeEnd(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
  ).toISOString();
}

export function parseInputDateValue(rawValue: string): Date | undefined {
  if (!rawValue) {
    return undefined;
  }

  const [yearPart, monthPart, dayPart] = rawValue.split("-").map(Number);
  if (!yearPart || !monthPart || !dayPart) {
    return undefined;
  }

  const parsedDate = new Date(yearPart, monthPart - 1, dayPart);
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
}

export function toInputDateValue(date?: Date): string {
  if (!date) {
    return "";
  }

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfLocalDay(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function clampDateToMax(date: Date, maxDate: Date): Date {
  return date > maxDate ? maxDate : date;
}

export function normalizeRangeWithMax(range: DateRange | undefined, maxDate: Date): DateRange | undefined {
  if (!range?.from) {
    return undefined;
  }

  const fromDate = clampDateToMax(range.from, maxDate);
  const toDate = clampDateToMax(range.to ?? range.from, maxDate);

  if (fromDate <= toDate) {
    return { from: fromDate, to: toDate };
  }

  return { from: toDate, to: fromDate };
}
