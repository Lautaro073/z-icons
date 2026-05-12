"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AdminDataTableProps } from "@/types/admin";
import { AdminTablePagination } from "./AdminTablePagination";
import { AdminTableCell } from "./AdminTableCell";

export function AdminDataTableBase<T>({
  data,
  columns,
  title,
  description,
  headerActions,
  isLoading,
  isError,
  isEmptyOverride,
  loadingComponent,
  errorComponent,
  emptyComponent,
  search,
  filters,
  pagination,
  common,
  onPageChange,
  tableMinWidthClassName = "w-full text-left text-sm",
}: AdminDataTableProps<T>) {
  const isEmpty = typeof isEmptyOverride === "boolean" ? isEmptyOverride : (!data || data.length === 0);

  return (
    <div className="flex flex-col gap-6">
      {(search || filters) && (
        <section className="ui-surface-panel rounded-[1.85rem] p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {search && (
              <Input
                placeholder={search.placeholder || "Buscar..."}
                value={search.value}
                onChange={(e) => search.onChange(e.currentTarget.value)}
              />
            )}
            {filters}
          </div>
        </section>
      )}

      <section className="grid gap-4 overflow-x-clip">
        <article className="ui-surface-panel flex min-h-120 min-w-0 flex-col rounded-[1.85rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {typeof title === "string" ? (
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              ) : (
                title
              )}
              {description && (
                typeof description === "string" ? (
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                ) : (
                  description
                )
              )}
            </div>
            {headerActions}
          </div>

          <div className="mt-4 min-h-120 min-w-0">
            {isLoading && loadingComponent}
            {isError && !isLoading && errorComponent}
            {isEmpty && !isLoading && !isError && emptyComponent}

            {!isLoading && !isError && !isEmpty && (
              <div className="overflow-x-auto overscroll-x-contain">
                <table className={tableMinWidthClassName}>
                  <thead className="sticky top-0 z-10 border-b border-border/60 text-[11px]">
                    <tr className="border-b border-border/60 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {columns.map((col) => (
                        <th
                          key={col.id}
                          className={col.isStickyRight 
                            ? `sticky right-0 relative px-3 py-3 text-right ${col.headerClassName || ""}`.trim()
                            : `px-3 py-3 text-left font-normal ${col.headerClassName || ""}`.trim()
                          }
                        >
                          {col.isStickyRight ? (
                            <>
                              <div className="absolute inset-0 -z-20 bg-background" />
                              <div className="absolute inset-0 -z-10 bg-surface" />
                              <span className="relative z-10">{col.header}</span>
                            </>
                          ) : (
                            col.header
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody>
                    {data.map((item, rowIndex) => (
                      <tr 
                        key={rowIndex} 
                        className="group border-b border-border/40 transition-colors duration-150 hover:bg-muted/16"
                      >
                        {columns.map((col) => (
                          col.isStickyRight ? (
                            <AdminTableCell 
                              key={`${rowIndex}-${col.id}`} 
                              className={`sticky right-0 relative p-0 ${col.className || ""}`.trim()}
                            >
                              <div className="absolute inset-0 -z-20 bg-background" />
                              <div className="absolute inset-0 -z-10 bg-surface transition-colors duration-150 group-hover:bg-muted/16" />
                              <div className="relative z-10 flex items-center justify-end px-3 py-3">
                                {col.cell(item, rowIndex)}
                              </div>
                            </AdminTableCell>
                          ) : (
                            <AdminTableCell 
                              key={`${rowIndex}-${col.id}`}
                              className={col.className}
                            >
                              {col.cell(item, rowIndex)}
                            </AdminTableCell>
                          )
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {pagination && common && onPageChange && (
            <AdminTablePagination
              usersPagination={pagination}
              common={common}
              onUsersPageChange={onPageChange}
            />
          )}
        </article>
      </section>
    </div>
  );
}
