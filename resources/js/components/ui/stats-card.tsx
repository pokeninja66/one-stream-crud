import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    loading?: boolean;
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    loading = false,
    className = '',
}: StatsCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {loading ? '...' : value}
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {loading ? 'Loading...' : description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
