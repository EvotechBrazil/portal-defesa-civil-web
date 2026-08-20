"use client";

import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";
import { TableRowSkeleton } from "@/components/ui/skeleton";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Coluna-título no layout de lista (mobile). */
  primary?: boolean;
  /** Vira chip sob o título em 390px. */
  chip?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  page,
  pageSize,
  total,
  onPageChange,
  onRowClick,
  isLoading,
  empty,
  caption,
  className,
}: {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  empty?: ReactNode;
  caption?: string;
  className?: string;
}) {
  const { t } = useI18n();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const primary = columns.find((column) => column.primary) ?? columns[0];
  const chips = columns.filter((column) => column.chip);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {isLoading && rows.length === 0 ? (
        <div className="divide-y divide-line" aria-busy="true">
          {Array.from({ length: 5 }, (_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-mist">{empty}</div>
      ) : (
        <>
          <div className="md:hidden">
            <ul className="divide-y divide-line">
              {rows.map((row) => {
                const clickable = Boolean(onRowClick);
                const content = (
                  <>
                    <p className="line-clamp-2 text-left text-sm font-medium text-paper">
                      {primary?.cell(row)}
                    </p>
                    {chips.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {chips.map((column) => (
                          <span
                            key={column.id}
                            className="inline-flex min-h-8 items-center rounded-chip bg-inset px-2 py-1 text-xs text-mist"
                          >
                            <span className="sr-only">{column.header}: </span>
                            {column.cell(row)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </>
                );
                return (
                  <li key={rowKey(row)}>
                    {clickable ? (
                      <button
                        type="button"
                        onClick={() => onRowClick?.(row)}
                        className="flex min-h-11 w-full flex-col py-3 text-left"
                      >
                        {content}
                      </button>
                    ) : (
                      <div className="py-3">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-sm">
              {caption ? <caption className="sr-only">{caption}</caption> : null}
              <thead>
                <tr className="border-b border-line">
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      scope="col"
                      className="px-3 py-2 font-mono text-micro font-medium uppercase tracking-[0.14em] text-mist"
                    >
                      {column.header}
                    </th>
                  ))}
                  {onRowClick ? <th className="w-10"><span className="sr-only">{t("ui.open")}</span></th> : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className={cn(
                      "border-b border-line last:border-0",
                      onRowClick && "cursor-pointer hover:bg-inset/70",
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          "px-3 py-3 align-middle text-paper",
                          column.primary && "font-medium",
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                    {onRowClick ? (
                      <td className="px-2 py-3 text-mist">
                        <button
                          type="button"
                          className="flex size-11 items-center justify-center"
                          onClick={(event) => {
                            event.stopPropagation();
                            onRowClick(row);
                          }}
                          aria-label={t("ui.open")}
                        >
                          <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {total > pageSize ? (
        <TablePagination
          from={from}
          to={to}
          total={total}
          page={page}
          pageCount={pageCount}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}

export function TablePagination({
  from,
  to,
  total,
  page,
  pageCount,
  onPageChange,
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="min-w-0 text-sm text-mist">
        {t("ui.paginationRange", { from, to, total, page, pageCount })}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-1 rounded-ctl border border-line bg-panel px-3 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden />
          {t("common.previous")}
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-1 rounded-ctl border border-line bg-panel px-3 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          {t("common.next")}
          <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </div>
  );
}
