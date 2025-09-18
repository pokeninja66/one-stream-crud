import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type BreadcrumbItem, type Stream, type StreamType, type StreamFilters, type StreamsResponse } from '@/types';
import { Plus, Search, Filter, SortAsc, SortDesc, Edit, Trash2, Eye, Calendar, DollarSign, Tag } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Streams',
        href: '/streams',
    },
];

export default function StreamsIndex() {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [streamTypes, setStreamTypes] = useState<StreamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<StreamFilters>({
        search: '',
        stream_type_id: undefined,
        order_by: 'created_at',
        order_dir: 'desc',
        per_page: 15,
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
    });

    // Fetch streams
    const fetchStreams = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
                ),
            });

            const response = await fetch(`/api/streams?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch streams');
            }

            const data: StreamsResponse = await response.json();
            setStreams(data.data);
            setPagination({
                current_page: data.meta.current_page,
                last_page: data.meta.last_page,
                total: data.meta.total,
                per_page: data.meta.per_page,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stream types
    const fetchStreamTypes = async () => {
        try {
            const response = await fetch('/api/stream-types');
            if (response.ok) {
                const data = await response.json();
                setStreamTypes(data);
            }
        } catch (err) {
            console.error('Failed to fetch stream types:', err);
        }
    };

    useEffect(() => {
        fetchStreamTypes();
    }, []);

    useEffect(() => {
        fetchStreams();
    }, [filters]);

    const handleFilterChange = (key: keyof StreamFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSort = (field: string) => {
        const newOrderDir = filters.order_by === field && filters.order_dir === 'asc' ? 'desc' : 'asc';
        setFilters(prev => ({
            ...prev,
            order_by: field,
            order_dir: newOrderDir,
        }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getSortIcon = (field: string) => {
        if (filters.order_by !== field) return null;
        return filters.order_dir === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Streams" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Streams</h1>
                        <p className="text-muted-foreground">
                            Manage your web streams with full CRUD operations
                        </p>
                    </div>
                    <Button onClick={() => router.visit('/streams/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Stream
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                        <CardDescription>
                            Use the filters below to find specific streams
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search by title or description..."
                                        value={filters.search || ''}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Stream Type</Label>
                                <Select
                                    value={filters.stream_type_id?.toString() || 'all'}
                                    onValueChange={(value) => handleFilterChange('stream_type_id', value === 'all' ? undefined : parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All types</SelectItem>
                                        {streamTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="per_page">Items per page</Label>
                                <Select
                                    value={filters.per_page?.toString() || '15'}
                                    onValueChange={(value) => handleFilterChange('per_page', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {loading ? (
                                <Skeleton className="h-4 w-32" />
                            ) : (
                                `Showing ${pagination.total} stream${pagination.total !== 1 ? 's' : ''}`
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSort('title')}
                                className="flex items-center gap-2"
                            >
                                Title {getSortIcon('title')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSort('tokens_price')}
                                className="flex items-center gap-2"
                            >
                                Price {getSortIcon('tokens_price')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSort('date_expiration')}
                                className="flex items-center gap-2"
                            >
                                Expiry {getSortIcon('date_expiration')}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Card key={i}>
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
                    ) : streams.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold">No streams found</h3>
                                    <p className="text-muted-foreground">
                                        {Object.values(filters).some(v => v !== undefined && v !== '') 
                                            ? 'Try adjusting your filters to see more results.'
                                            : 'Get started by creating your first stream.'
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {streams.map((stream) => (
                                <Card key={stream.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg line-clamp-2">{stream.title}</CardTitle>
                                                {stream.type && (
                                                    <Badge variant="secondary" className="w-fit">
                                                        <Tag className="mr-1 h-3 w-3" />
                                                        {stream.type.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {stream.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {stream.description}
                                            </p>
                                        )}
                                        
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <DollarSign className="h-4 w-4" />
                                                <span className="font-medium">{stream.tokens_price}</span>
                                                <span>tokens</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(stream.date_expiration)}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1"
                                                onClick={() => {
                                                    // For now, just show an alert - you can implement a view modal later
                                                    alert(`Viewing stream: ${stream.title}`);
                                                }}
                                            >
                                                <Eye className="mr-1 h-3 w-3" />
                                                View
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1"
                                                onClick={() => router.visit(`/streams/${stream.id}/edit`)}
                                            >
                                                <Edit className="mr-1 h-3 w-3" />
                                                Edit
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="flex-1 text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="mr-1 h-3 w-3" />
                                                        Delete
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Stream</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete "{stream.title}"? This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button 
                                                            variant="destructive"
                                                            onClick={async () => {
                                                                try {
                                                                    const response = await fetch(`/api/streams/${stream.id}`, {
                                                                        method: 'DELETE',
                                                                    });
                                                                    if (response.ok) {
                                                                        // Refresh the streams list
                                                                        fetchStreams(pagination.current_page);
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Failed to delete stream:', err);
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchStreams(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchStreams(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
