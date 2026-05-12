import { ReactNode } from "react";

export interface AdminPagination {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface AdminColumnDef<T> {
  id: string;
  header: string | ReactNode;
  cell: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  isStickyRight?: boolean;
}

export interface AdminDataTableProps<T> {
  data: T[];
  columns: AdminColumnDef<T>[];
  title: string | ReactNode;
  description?: string | ReactNode;
  headerActions?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  isEmptyOverride?: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  emptyComponent?: ReactNode;
  search?: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  };
  filters?: ReactNode;
  pagination?: AdminPagination | null;
  common?: (key: string) => string;
  onPageChange?: (page: number) => void;
  tableMinWidthClassName?: string;
}
