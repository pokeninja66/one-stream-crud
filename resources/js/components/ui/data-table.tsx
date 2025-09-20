import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, SortAsc, SortDesc } from 'lucide-react';

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (value: any, item: T) => React.ReactNode;
    className?: string;
}

export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

export interface PaginationConfig {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    error?: string | null;
    pagination?: PaginationConfig;
    onPageChange?: (page: number) => void;
    onSort?: (field: string) => void;
    sortConfig?: SortConfig;
    emptyState?: {
        title: string;
        description: string;
        action?: React.ReactNode;
    };
    className?: string;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    error = null,
    pagination,
    onPageChange,
    onSort,
    sortConfig,
    emptyState,
    className = '',
}: DataTableProps<T>) {
    const getSortIcon = (field: string) => {
        if (!sortConfig || sortConfig.field !== field) return null;
        return sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
    };

    const handleSort = (field: string) => {
        if (onSort) {
            onSort(field);
        }
    };

    if (loading) {
        return (
            <Card className={className}>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="pt-6">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className={className}>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{emptyState?.title || 'No data found'}</h3>
                        <p className="text-muted-foreground">
                            {emptyState?.description || 'No data available to display.'}
                        </p>
                        {emptyState?.action && <div className="mt-6">{emptyState.action}</div>}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="rounded-lg border p-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 flex-1 items-center space-x-4">
                                    {columns.map((column) => {
                                        const value = typeof column.key === 'string' 
                                            ? column.key.split('.').reduce((obj, key) => obj?.[key], item)
                                            : item[column.key];
                                        
                                        return (
                                            <div key={String(column.key)} className={`min-w-0 flex-1 ${column.className || ''}`}>
                                                {column.render ? column.render(value, item) : (
                                                    <div className="text-sm">
                                                        {value}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
