import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Stream } from '@/types';
import { DollarSign, Calendar, Tag, Edit, Trash2, Eye } from 'lucide-react';

export interface StreamCardProps {
    stream: Stream;
    onView?: (stream: Stream) => void;
    onEdit?: (stream: Stream) => void;
    onDelete?: (stream: Stream) => void;
    showActions?: boolean;
    className?: string;
}

export function StreamCard({ 
    stream, 
    onView,
    onEdit, 
    onDelete, 
    showActions = true, 
    className = '' 
}: StreamCardProps) {
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
            <div className="space-y-4">
                {/* Header with title and type */}
                <div className="space-y-2">
                    <h4 className="font-medium line-clamp-2">{stream.title}</h4>
                    {stream.type && (
                        <Badge variant="secondary" className="w-fit text-xs">
                            <Tag className="mr-1 h-3 w-3" />
                            {stream.type.name}
                        </Badge>
                    )}
                </div>

                {/* Description */}
                {stream.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {stream.description}
                    </p>
                )}

                {/* Price and expiration */}
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

                {/* Actions */}
                {showActions && (
                    <div className="flex flex-wrap gap-2">
                        {onView && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 min-w-0"
                                onClick={() => onView(stream)}
                            >
                                <Eye className="mr-1 h-3 w-3" />
                                <span className="hidden sm:inline">View</span>
                            </Button>
                        )}
                        {onEdit && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 min-w-0"
                                onClick={() => onEdit(stream)}
                            >
                                <Edit className="mr-1 h-3 w-3" />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>
                        )}
                        {onDelete && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 min-w-0 text-destructive hover:text-destructive"
                                onClick={() => onDelete(stream)}
                            >
                                <Trash2 className="mr-1 h-3 w-3" />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
