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
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Plus, Search, Edit, Trash2, User, Mail, Calendar, Shield, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '#' },
];

export default function UsersIndex() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [formLoading, setFormLoading] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.data || data);
            toast.success(`Loaded ${data.data?.length || data.length} users`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            toast.error(`Failed to load users: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            setFormErrors({ 
                name: !formData.name.trim() ? 'Name is required' : '',
                email: !formData.email.trim() ? 'Email is required' : ''
            });
            return;
        }

        setFormLoading(true);
        setFormErrors({});

        try {
            const response = await fetch('/api/users', {
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
                    toast.error('Validation errors occurred');
                } else {
                    const errorMessage = errorData.message || 'An error occurred';
                    setFormErrors({ general: errorMessage });
                    toast.error(errorMessage);
                }
                return;
            }

            setIsCreateDialogOpen(false);
            setFormData({ name: '', email: '', password: '' });
            fetchUsers();
            toast.success('User created successfully!');
        } catch (err) {
            const errorMessage = 'An error occurred while creating the user';
            setFormErrors({ general: errorMessage });
            toast.error(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editingUser || !formData.name.trim() || !formData.email.trim()) {
            setFormErrors({ 
                name: !formData.name.trim() ? 'Name is required' : '',
                email: !formData.email.trim() ? 'Email is required' : ''
            });
            return;
        }

        setFormLoading(true);
        setFormErrors({});

        try {
            const response = await fetch(`/api/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    ...(formData.password && { password: formData.password })
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                    setFormErrors(errorData.errors);
                    toast.error('Validation errors occurred');
                } else {
                    const errorMessage = errorData.message || 'An error occurred';
                    setFormErrors({ general: errorMessage });
                    toast.error(errorMessage);
                }
                return;
            }

            setIsEditDialogOpen(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '' });
            fetchUsers();
            toast.success('User updated successfully!');
        } catch (err) {
            const errorMessage = 'An error occurred while updating the user';
            setFormErrors({ general: errorMessage });
            toast.error(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                toast.error('Failed to delete user');
                return;
            }

            fetchUsers();
            toast.success('User deleted successfully!');
        } catch (err) {
            console.error('Failed to delete user:', err);
            toast.error('Failed to delete user');
        }
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
        });
        setIsEditDialogOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
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
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
                            <p className="text-muted-foreground">
                                Manage user accounts and permissions
                            </p>
                        </div>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="self-start sm:self-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Create User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create User</DialogTitle>
                                <DialogDescription>
                                    Add a new user to the system.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {formErrors.general && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{formErrors.general}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter user name"
                                        className={formErrors.name ? 'border-destructive' : ''}
                                    />
                                    {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter user email"
                                        className={formErrors.email ? 'border-destructive' : ''}
                                    />
                                    {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter password"
                                        className={formErrors.password ? 'border-destructive' : ''}
                                    />
                                    {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCreate} disabled={formLoading}>
                                    {formLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                                    Create User
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search Users
                        </CardTitle>
                        <CardDescription>
                            Find users by name or email address
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({filteredUsers.length})</CardTitle>
                        <CardDescription>
                            Manage user accounts and view their details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {loading ? (
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
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-sm font-semibold">No users found</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new user.'}
                                </p>
                                {!searchTerm && (
                                    <div className="mt-6">
                                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create User
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredUsers.map((user) => (
                                    <div key={user.id} className="rounded-lg border p-4">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex min-w-0 flex-1 items-center space-x-4">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate font-medium">{user.name}</h4>
                                                    <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(user.created_at)}
                                                        </span>
                                                        {user.email_verified_at && (
                                                            <Badge variant="secondary" className="w-fit text-xs">
                                                                <Shield className="mr-1 h-3 w-3" />
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-shrink-0 gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(user)}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete User</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete "{user.name}"? This action cannot be undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline">Cancel</Button>
                                                            <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                                                                Delete
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                                Update user information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {formErrors.general && (
                                <Alert variant="destructive">
                                    <AlertDescription>{formErrors.general}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name *</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter user name"
                                    className={formErrors.name ? 'border-destructive' : ''}
                                />
                                {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email *</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter user email"
                                    className={formErrors.email ? 'border-destructive' : ''}
                                />
                                {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-password">New Password (optional)</Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter new password (leave blank to keep current)"
                                    className={formErrors.password ? 'border-destructive' : ''}
                                />
                                {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEdit} disabled={formLoading}>
                                {formLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                                Update User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
