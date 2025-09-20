import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SearchBar } from '@/components/ui/search-bar';
import { FormDialog } from '@/components/ui/form-dialog';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { UserCard } from '@/components/ui/user-card';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Plus, User } from 'lucide-react';
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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
            console.error('Failed to create user:', err);
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
            console.error('Failed to update user:', err);
        } finally {
            setFormLoading(false);
        }
    };

    // const handleDelete = async (userId: string) => {
    //     try {
    //         const response = await fetch(`/api/users/${userId}`, {
    //             method: 'DELETE',
    //         });

    //         if (!response.ok) {
    //             toast.error('Failed to delete user');
    //             return;
    //         }

    //         fetchUsers();
    //         toast.success('User deleted successfully!');
    //     } catch (err) {
    //         console.error('Failed to delete user:', err);
    //         toast.error('Failed to delete user');
    //     }
    // };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
        });
        setIsEditDialogOpen(true);
    };

    const openCreateDialog = () => {
        setFormData({ name: '', email: '', password: '' });
        setFormErrors({});
        setIsCreateDialogOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


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
                    <Button onClick={openCreateDialog} className="self-start sm:self-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create User
                    </Button>
                </div>

                {/* Search */}
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by name or email..."
                    label="Search Users"
                    description="Find users by name or email address"
                />

                {/* Users List */}
                <div className="space-y-4">
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
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <User className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-semibold">No users found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new user.'}
                            </p>
                            {!searchTerm && (
                                <div className="mt-6">
                                    <Button onClick={openCreateDialog}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create User
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={openEditDialog}
                                onDelete={(user) => {
                                    setSelectedUser(user);
                                    setIsDeleteDialogOpen(true);
                                }}
                            />
                        ))
                    )}
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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

                {/* Delete Dialog */}
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    title="Delete User"
                    description="Are you sure you want to delete this user? This action cannot be undone."
                    itemName={selectedUser?.name || ''}
                    onConfirm={async () => {
                        if (!selectedUser) return;
                        try {
                            const response = await fetch(`/api/users/${selectedUser.id}`, {
                                method: 'DELETE',
                            });
                            if (!response.ok) {
                                toast.error('Failed to delete user');
                                return;
                            }
                            fetchUsers();
                            setIsDeleteDialogOpen(false);
                            toast.success('User deleted successfully!');
                        } catch (err) {
                            console.error('Failed to delete user:', err);
                            toast.error('Failed to delete user');
                        }
                    }}
                />
            </div>
        </AppLayout>
    );
}
