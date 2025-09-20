import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatsCard } from '@/components/ui/stats-card';
import { FormDialog, FormField } from '@/components/ui/form-dialog';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { StreamCard } from '@/components/ui/stream-card';
import { JsonDataModal } from '@/components/ui/json-data-modal';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Stream, type StreamType } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Database, LoaderCircle, Plus, Rss, Tag, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const [streams, setStreams] = useState<Stream[]>([]);
    const [streamTypes, setStreamTypes] = useState<StreamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateStreamDialogOpen, setIsCreateStreamDialogOpen] = useState(false);
    const [isCreateTypeDialogOpen, setIsCreateTypeDialogOpen] = useState(false);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
    const [selectedStreamData, setSelectedStreamData] = useState<Stream | null>(null);
    const [streamFormData, setStreamFormData] = useState({
        title: '',
        description: '',
        tokens_price: 1,
        stream_type_id: undefined as number | undefined,
        date_expiration: '',
    });
    const [typeFormData, setTypeFormData] = useState({ name: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [streamsResponse, typesResponse] = await Promise.all([fetch('/api/streams'), fetch('/api/stream-types')]);

            if (!streamsResponse.ok || !typesResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const streamsData = await streamsResponse.json();
            const typesData = await typesResponse.json();

            setStreams(streamsData.data || []);
            setStreamTypes(typesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateStream = async () => {
        if (!streamFormData.title.trim()) {
            setFormErrors({ title: 'Title is required' });
            return;
        }

        setFormLoading(true);
        setFormErrors({});

        try {
            const response = await fetch('/api/streams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    ...streamFormData,
                    date_expiration: new Date(streamFormData.date_expiration).toISOString().slice(0, 19).replace('T', ' '),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                    setFormErrors(errorData.errors);
                } else {
                    setFormErrors({ general: errorData.message || 'An error occurred' });
                }
                return;
            }

            setIsCreateStreamDialogOpen(false);
            setStreamFormData({
                title: '',
                description: '',
                tokens_price: 1,
                stream_type_id: undefined,
                date_expiration: '',
            });
            fetchData();
        } catch (err) {
            setFormErrors({ general: 'An error occurred while creating the stream' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleCreateType = async () => {
        if (!typeFormData.name.trim()) {
            setFormErrors({ name: 'Name is required' });
            return;
        }

        setFormLoading(true);
        setFormErrors({});

        try {
            const response = await fetch('/api/stream-types', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(typeFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                    setFormErrors(errorData.errors);
                } else {
                    setFormErrors({ general: errorData.message || 'An error occurred' });
                }
                return;
            }

            setIsCreateTypeDialogOpen(false);
            setTypeFormData({ name: '' });
            fetchData();
        } catch (err) {
            setFormErrors({ general: 'An error occurred while creating the stream type' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteStream = async (id: string) => {
        try {
            const response = await fetch(`/api/streams/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchData();
            }
        } catch (err) {
            console.error('Failed to delete stream:', err);
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Welcome Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to Streams CRUD</h1>
                    <p className="text-muted-foreground">Manage your web streams with our comprehensive CRUD API system.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                    <StatsCard
                        title="Total Streams"
                        value={streams.length}
                        description={loading ? 'Loading...' : streams.length === 0 ? 'No streams created yet' : 'Active streams'}
                        icon={Database}
                        loading={loading}
                    />
                    <StatsCard
                        title="Stream Types"
                        value={streamTypes.length}
                        description={loading ? 'Loading...' : 'Available categories'}
                        icon={Zap}
                        loading={loading}
                    />
                    <StatsCard
                        title="API Endpoints"
                        value="9"
                        description="Full CRUD operations"
                        icon={Rss}
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stream Management</CardTitle>
                            <CardDescription>Create, view, edit, and delete streams with our intuitive interface.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Create Stream</Badge>
                                <Badge variant="secondary">List Streams</Badge>
                                <Badge variant="secondary">Edit Stream</Badge>
                                <Badge variant="secondary">Delete Stream</Badge>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => router.visit('/streams')} className="flex-1">
                                    <Database className="mr-2 h-4 w-4" />
                                    Manage Streams
                                </Button>
                                <Dialog open={isCreateStreamDialogOpen} onOpenChange={setIsCreateStreamDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Create Stream</DialogTitle>
                                            <DialogDescription>Add a new stream to your collection.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            {formErrors.general && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>{formErrors.general}</AlertDescription>
                                                </Alert>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Title *</Label>
                                                <Input
                                                    id="title"
                                                    value={streamFormData.title}
                                                    onChange={(e) => setStreamFormData((prev) => ({ ...prev, title: e.target.value }))}
                                                    placeholder="Enter stream title"
                                                    className={formErrors.title ? 'border-destructive' : ''}
                                                />
                                                {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="tokens_price">Tokens Price *</Label>
                                                <Input
                                                    id="tokens_price"
                                                    type="number"
                                                    min="1"
                                                    value={streamFormData.tokens_price}
                                                    onChange={(e) =>
                                                        setStreamFormData((prev) => ({ ...prev, tokens_price: parseInt(e.target.value) || 1 }))
                                                    }
                                                    placeholder="Enter price in tokens"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="stream_type_id">Stream Type</Label>
                                                <Select
                                                    value={streamFormData.stream_type_id?.toString() || 'none'}
                                                    onValueChange={(value) =>
                                                        setStreamFormData((prev) => ({
                                                            ...prev,
                                                            stream_type_id: value === 'none' ? undefined : parseInt(value),
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select stream type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">No type selected</SelectItem>
                                                        {streamTypes.map((type) => (
                                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                                {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="date_expiration">Expiration Date *</Label>
                                                <DateTimePicker
                                                    value={streamFormData.date_expiration}
                                                    onChange={(value) => setStreamFormData((prev) => ({ ...prev, date_expiration: value }))}
                                                    placeholder="Select expiration date and time"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsCreateStreamDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleCreateStream} disabled={formLoading}>
                                                {formLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                                Create Stream
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Stream Types</CardTitle>
                            <CardDescription>Manage stream type categories for better organization.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">Create Type</Badge>
                                <Badge variant="outline">Edit Type</Badge>
                                <Badge variant="outline">Delete Type</Badge>
                                <Badge variant="outline">Manage Types</Badge>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => router.visit('/stream-types')} className="flex-1">
                                    <Tag className="mr-2 h-4 w-4" />
                                    Manage Types
                                </Button>
                                <Dialog open={isCreateTypeDialogOpen} onOpenChange={setIsCreateTypeDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create Stream Type</DialogTitle>
                                            <DialogDescription>Add a new stream type category.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            {formErrors.general && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>{formErrors.general}</AlertDescription>
                                                </Alert>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="type-name">Name *</Label>
                                                <Input
                                                    id="type-name"
                                                    value={typeFormData.name}
                                                    onChange={(e) => setTypeFormData({ name: e.target.value })}
                                                    placeholder="Enter stream type name"
                                                    className={formErrors.name ? 'border-destructive' : ''}
                                                />
                                                {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsCreateTypeDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleCreateType} disabled={formLoading}>
                                                {formLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                                Create Type
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Streams */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Streams</CardTitle>
                        <CardDescription>Your latest streams with quick actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                                            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : streams.length === 0 ? (
                            <EmptyState
                                icon={Database}
                                title="No streams"
                                description="Get started by creating a new stream."
                                action={{
                                    label: "Create Stream",
                                    onClick: () => setIsCreateStreamDialogOpen(true),
                                    icon: Plus
                                }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {streams.slice(0, 5).map((stream) => (
                                    <StreamCard
                                        key={stream.id}
                                        stream={stream}
                                        onView={(stream) => {
                                            setSelectedStreamData(stream);
                                            setIsJsonModalOpen(true);
                                        }}
                                        onEdit={(stream) => router.visit(`/streams/${stream.id}/edit`)}
                                        onDelete={(stream) => handleDeleteStream(stream.id)}
                                    />
                                ))}
                                {streams.length > 5 && (
                                    <div className="pt-4 text-center">
                                        <Button variant="outline" onClick={() => router.visit('/streams')}>
                                            View All Streams
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* JSON Data Modal */}
                <JsonDataModal
                    open={isJsonModalOpen}
                    onOpenChange={setIsJsonModalOpen}
                    data={selectedStreamData}
                    title="Stream Raw Data"
                    description="View the raw JSON data for this stream. You can copy this data to use elsewhere."
                />
            </div>
        </AppLayout>
    );
}
