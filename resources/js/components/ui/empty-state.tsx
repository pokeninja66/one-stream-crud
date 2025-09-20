import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
    return (
        <Card className={className}>
            <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                    <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-muted-foreground mt-1">{description}</p>
                    {action && (
                        <div className="mt-6">
                            <Button onClick={action.onClick}>
                                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                                {action.label}
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
