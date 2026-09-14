import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { Input } from './Input';
import { TableSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { toPersianDigits } from '../../lib/formatters';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T | ((item: T) => string);
  searchPlaceholder?: string;
  loading?: boolean;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: (row: T) => React.ReactNode;
  extraHeader?: React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'جستجو در موارد...',
  loading = false,
  pageSize = 10,
  emptyTitle,
  emptyDescription,
  actions,
  extraHeader,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) => {
      if (typeof searchKey === 'function') {
        return searchKey(item).toLowerCase().includes(q);
      }
      if (searchKey && item[searchKey]) {
        return String(item[searchKey]).toLowerCase().includes(q);
      }
      return Object.values(item as any).some((val) =>
        String(val).toLowerCase().includes(q)
      );
    });
  }, [data, search, searchKey]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="w-full sm:w-72">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            rightIcon={<Search className="w-4 h-4 text-slate-400" />}
            className="bg-white py-2 text-xs"
          />
        </div>
        {extraHeader && <div className="flex items-center gap-2 w-full sm:w-auto">{extraHeader}</div>}
      </div>

      {/* Table Area */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : paginatedData.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-slate-600 text-xs font-semibold">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className="py-3.5 px-4 select-none"
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <span>{col.header}</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
                {actions && <th className="py-3.5 px-4 text-left">عملیات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedData.map((row, idx) => (
                <tr
                  key={row.id ? String(row.id) : idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3.5 px-4 text-slate-800">
                      {col.render
                        ? col.render(row, (currentPage - 1) * pageSize + idx)
                        : (row as any)[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-3.5 px-4 text-left whitespace-nowrap">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && sortedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/30">
          <div>
            نمایش {toPersianDigits((currentPage - 1) * pageSize + 1)} تا{' '}
            {toPersianDigits(Math.min(currentPage * pageSize, sortedData.length))} از مجموع{' '}
            {toPersianDigits(sortedData.length)} مورد
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              صفحه {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
