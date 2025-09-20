import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    description?: string;
    className?: string;
    showCard?: boolean;
}

export function SearchBar({
    value,
    onChange,
    placeholder = 'Search...',
    label,
    description,
    className = '',
    showCard = true,
}: SearchBarProps) {
    const input = (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10"
            />
        </div>
    );

    if (!showCard) {
        return input;
    }

    return (
        <Card>
            {label && (
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        {label}
                    </CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent className={label ? '' : 'pt-6'}>
                {label ? (
                    <div className="space-y-2">
                        <Label htmlFor="search">{label}</Label>
                        {input}
                    </div>
                ) : (
                    input
                )}
            </CardContent>
        </Card>
    );
}
