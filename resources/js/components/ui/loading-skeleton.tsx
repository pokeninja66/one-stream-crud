import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export interface LoadingSkeletonProps {
    type?: 'card' | 'list' | 'grid';
    count?: number;
    className?: string;
}

export function LoadingSkeleton({ type = 'list', count = 5, className = '' }: LoadingSkeletonProps) {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return Array.from({ length: count }).map((_, i) => (
                    <Card key={i} className={className}>
                        <CardHeader>
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ));

            case 'grid':
                return Array.from({ length: count }).map((_, i) => (
                    <Card key={i} className={className}>
                        <CardHeader>
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-full" />
                        </CardContent>
                    </Card>
                ));

            case 'list':
            default:
                return Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={`flex items-center space-x-4 ${className}`}>
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ));
        }
    };

    return <div className="space-y-4">{renderSkeleton()}</div>;
}
