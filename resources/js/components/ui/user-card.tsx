import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail, Calendar, Shield, Edit, Trash2 } from 'lucide-react';

export interface UserCardProps {
    user: {
        id: string;
        name: string;
        email: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
    };
    onEdit?: (user: any) => void;
    onDelete?: (user: any) => void;
    showActions?: boolean;
    className?: string;
}

export function UserCard({ 
    user, 
    onEdit, 
    onDelete, 
    showActions = true, 
    className = '' 
}: UserCardProps) {
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
        <div className={`rounded-lg border p-4 ${className}`}>
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
                {showActions && (
                    <div className="flex flex-shrink-0 gap-2">
                        {onEdit && (
                            <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                                <Edit className="h-3 w-3" />
                            </Button>
                        )}
                        {onDelete && (
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
                                        <Button variant="destructive" onClick={() => onDelete(user)}>
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
