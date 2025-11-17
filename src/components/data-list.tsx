import React from 'react';
import { Card, CardContent } from './ui/card';
import { cn } from './ui/utils';

export interface Column {
  key: string;
  label: string;
  className?: string;
}

interface DataListProps<T> {
  data: T[];
  columns: Column[];
  renderCell: (item: T, column: Column) => React.ReactNode;
  renderMobileCard: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  getRowKey: (item: T) => string | number;
}

export function DataList<T>({
  data,
  columns,
  renderCell,
  renderMobileCard,
  onRowClick,
  getRowKey,
}: DataListProps<T>) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-6 py-4 text-left text-sm font-medium text-muted-foreground",
                      column.className
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item) => (
                <tr
                  key={getRowKey(item)}
                  className={cn(
                    "hover:bg-muted/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {data.map((item) => (
          <Card
            key={getRowKey(item)}
            className={cn(
              "transition-colors min-h-[120px]",
              onRowClick && "cursor-pointer hover:bg-muted/50"
            )}
            onClick={() => onRowClick?.(item)}
          >
            <CardContent className="p-10">
              {renderMobileCard(item)}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}