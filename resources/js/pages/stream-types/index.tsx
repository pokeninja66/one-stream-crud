import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type BreadcrumbItem, type StreamType } from '@/types';
import { Plus, Search, Edit, Trash2, Tag, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stream Types', href: '/stream-types' },
];

export default function StreamTypesIndex() {
    const [streamTypes, setStreamTypes] = useState<StreamType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<StreamType | null>(null);
    const [formData, setFormData] = useState({ name: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Fetch stream types
    const fetchStreamTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/stream-types');
            if (!response.ok) {
                throw new Error('Failed to fetch stream types');
            }

            const data = await response.json();
            setStreamTypes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreamTypes();
    }, []);

    const handleCreate = async () => {
        if (!formData.name.trim()) {
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
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
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

            setIsCreateDialogOpen(false);
            setFormData({ name: '' });
            fetchStreamTypes();
        } catch (err) {
            setFormErrors({ general: 'An error occurred while creating the stream type' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!formData.name.trim()) {
            setFormErrors({ name: 'Name is required' });
            return;
        }

        setFormLoading(true);
        setFormErrors({});

        try {
            const response = await fetch(`/api/stream-types/${editingType?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
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

            setIsEditDialogOpen(false);
            setEditingType(null);
            setFormData({ name: '' });
            fetchStreamTypes();
        } catch (err) {
            setFormErrors({ general: 'An error occurred while updating the stream type' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/stream-types/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchStreamTypes();
            }
        } catch (err) {
            console.error('Failed to delete stream type:', err);
        }
    };

    const openEditDialog = (type: StreamType) => {
        setEditingType(type);
        setFormData({ name: type.name });
        setIsEditDialogOpen(true);
    };

    const filteredTypes = streamTypes.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stream Types" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/dashboard')}
                            className="self-start"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Stream Types</h1>
                            <p className="text-muted-foreground">
                                Manage stream type categories
                            </p>
                        </div>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="self-start sm:self-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Type
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Stream Type</DialogTitle>
                                <DialogDescription>
                                    Add a new stream type to categorize your streams.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {formErrors.general && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{formErrors.general}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                        placeholder="Enter stream type name"
                                        className={formErrors.name ? 'border-destructive' : ''}
                                    />
                                    {formErrors.name && (
                                        <p className="text-sm text-destructive">{formErrors.name}</p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreate} disabled={formLoading}>
                                    {formLoading ? 'Creating...' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search stream types..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-4">
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
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredTypes.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold">No stream types found</h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm ? 'Try adjusting your search term.' : 'Get started by creating your first stream type.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTypes.map((type) => (
                                <Card key={type.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">{type.name}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1"
                                                onClick={() => openEditDialog(type)}
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
                                                        <DialogTitle>Delete Stream Type</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete "{type.name}"? This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline">Cancel</Button>
                                                        <Button 
                                                            variant="destructive"
                                                            onClick={() => handleDelete(type.id)}
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
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Stream Type</DialogTitle>
                            <DialogDescription>
                                Update the stream type information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {formErrors.general && (
                                <Alert variant="destructive">
                                    <AlertDescription>{formErrors.general}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    placeholder="Enter stream type name"
                                    className={formErrors.name ? 'border-destructive' : ''}
                                />
                                {formErrors.name && (
                                    <p className="text-sm text-destructive">{formErrors.name}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} disabled={formLoading}>
                                {formLoading ? 'Updating...' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
