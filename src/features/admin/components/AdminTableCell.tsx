import type { ReactNode } from "react";

export interface AdminTableCellProps {
  children: ReactNode;
  className?: string;
}

export function AdminTableCell({ children, className = "" }: AdminTableCellProps) {
  return <td className={`px-3 py-4 ${className}`.trim()}>{children}</td>;
}
