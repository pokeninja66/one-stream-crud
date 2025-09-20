import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Trash2, Eye } from 'lucide-react';

export interface DataGridColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    className?: string;
}

export interface DataGridAction<T> {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: (item: T) => void;
    variant?: 'default' | 'outline' | 'destructive';
    className?: string;
}

export interface DataGridProps<T> {
    data: T[];
    columns: DataGridColumn<T>[];
    actions?: DataGridAction<T>[];
    loading?: boolean;
    error?: string | null;
    emptyState?: {
        title: string;
        description: string;
        action?: React.ReactNode;
    };
    className?: string;
    gridClassName?: string;
}

export function DataGrid<T extends Record<string, any>>({
    data,
    columns,
    actions = [],
    loading = false,
    error = null,
    emptyState,
    className = '',
    gridClassName = 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
}: DataGridProps<T>) {
    if (loading) {
        return (
            <div className={gridClassName}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className={className}>
                        <CardHeader>
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
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
        <div className={gridClassName}>
            {data.map((item, index) => (
                <Card key={index} className={`hover:shadow-md transition-shadow ${className}`}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                {columns.map((column) => {
                                    const value = typeof column.key === 'string' 
                                        ? column.key.split('.').reduce((obj, key) => obj?.[key], item)
                                        : item[column.key];
                                    
                                    return (
                                        <div key={String(column.key)} className={column.className || ''}>
                                            {column.render ? column.render(value, item) : (
                                                <CardTitle className="text-lg line-clamp-2">
                                                    {value}
                                                </CardTitle>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {actions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {actions.map((action, actionIndex) => (
                                    <Button
                                        key={actionIndex}
                                        variant={action.variant || 'outline'}
                                        size="sm"
                                        className={`flex-1 min-w-0 ${action.className || ''}`}
                                        onClick={() => action.onClick(item)}
                                    >
                                        <action.icon className="mr-1 h-3 w-3" />
                                        <span className="hidden sm:inline">{action.label}</span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
