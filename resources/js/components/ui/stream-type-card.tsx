import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';

export interface StreamTypeCardProps {
    streamType: {
        id: number;
        name: string;
    };
    onEdit?: (streamType: any) => void;
    onDelete?: (streamType: any) => void;
    showActions?: boolean;
    className?: string;
}

export function StreamTypeCard({ 
    streamType, 
    onEdit, 
    onDelete, 
    showActions = true, 
    className = '' 
}: StreamTypeCardProps) {
    return (
        <Card className={`hover:shadow-md transition-shadow ${className}`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{streamType.name}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {showActions && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => onEdit(streamType)}
                            >
                                <Edit className="mr-1 h-3 w-3" />
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-destructive hover:text-destructive"
                                onClick={() => onDelete(streamType)}
                            >
                                <Trash2 className="mr-1 h-3 w-3" />
                                Delete
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
