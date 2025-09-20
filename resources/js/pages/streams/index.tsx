import { useState, useEffect, useCallback } from 'react';
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
import { JsonDataModal } from '@/components/ui/json-data-modal';
import { SearchBar } from '@/components/ui/search-bar';
import { DataGrid, DataGridColumn, DataGridAction } from '@/components/ui/data-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { StreamCard } from '@/components/ui/stream-card';
import { type BreadcrumbItem, type Stream, type StreamType, type StreamFilters, type StreamsResponse } from '@/types';
import { Plus, Search, Filter, SortAsc, SortDesc, Edit, Trash2, Eye, Calendar, DollarSign, Tag, Code, Database } from 'lucide-react';
import { toast } from 'sonner';

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
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
    const [selectedStreamData, setSelectedStreamData] = useState<Stream | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Fetch streams
    const fetchStreams = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const params = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(
                    Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
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
            toast.success(`Loaded ${data.data.length} streams`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            toast.error(`Failed to load streams: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }, [filters]);

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
    }, [filters, fetchStreams]);

    const handleFilterChange = (key: keyof StreamFilters, value: string | number | undefined) => {
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

    const getSortIcon = (field: string) => {
        if (filters.order_by !== field) return null;
        return filters.order_dir === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Streams" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Streams</h1>
                        <p className="text-muted-foreground">
                            Manage your web streams with full CRUD operations
                        </p>
                    </div>
                    <Button onClick={() => router.visit('/streams/create')} className="self-start sm:self-auto">
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
                                <SearchBar
                                    value={filters.search || ''}
                                    onChange={(value) => handleFilterChange('search', value)}
                                    placeholder="Search by title or description..."
                                    showCard={false}
                                />
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
                        <EmptyState
                            icon={Database}
                            title="No streams found"
                            description={Object.values(filters).some(v => v !== undefined && v !== '') 
                                ? 'Try adjusting your filters to see more results.'
                                : 'Get started by creating your first stream.'}
                            action={
                                !Object.values(filters).some(v => v !== undefined && v !== '') ? {
                                    label: 'Create Stream',
                                    onClick: () => router.visit('/streams/create'),
                                    icon: Plus
                                } : undefined
                            }
                        />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {streams.map((stream) => (
                                <StreamCard
                                    key={stream.id}
                                    stream={stream}
                                    onView={(stream) => {
                                        setSelectedStreamData(stream);
                                        setIsJsonModalOpen(true);
                                    }}
                                    onEdit={(stream) => router.visit(`/streams/${stream.id}/edit`)}
                                    onDelete={(stream) => {
                                        setSelectedStreamData(stream);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                />
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

                {/* JSON Data Modal */}
                <JsonDataModal
                    open={isJsonModalOpen}
                    onOpenChange={setIsJsonModalOpen}
                    data={selectedStreamData}
                    title="Stream Raw Data"
                    description="View the raw JSON data for this stream. You can copy this data to use elsewhere."
                />

                {/* Delete Dialog */}
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    title="Delete Stream"
                    description="Are you sure you want to delete this stream? This action cannot be undone."
                    itemName={selectedStreamData?.title || ''}
                    onConfirm={async () => {
                        if (!selectedStreamData) return;
                        // Should probably be moved to a separate function.
                        try {
                            const response = await fetch(`/api/streams/${selectedStreamData.id}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                toast.success(`Stream "${selectedStreamData.title}" deleted successfully`);
                                fetchStreams(pagination.current_page);
                                setIsDeleteDialogOpen(false);
                            } else {
                                toast.error('Failed to delete stream');
                            }
                        } catch (err) {
                            console.error('Failed to delete stream:', err);
                            toast.error('Failed to delete stream');
                        }
                    }}
                />
            </div>
        </AppLayout>
    );
}
