import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoaderCircle } from 'lucide-react';

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'datetime';
    required?: boolean;
    placeholder?: string;
    options?: { value: string | number; label: string }[];
    min?: number;
    max?: number;
    step?: number;
}

export interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    fields: FormField[];
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => Promise<void>;
    loading?: boolean;
    errors?: Record<string, string>;
    submitLabel?: string;
    cancelLabel?: string;
}

export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    fields,
    initialData = {},
    onSubmit,
    loading = false,
    errors = {},
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
}: FormDialogProps) {
    const [formData, setFormData] = useState<Record<string, any>>(initialData);

    useEffect(() => {
        if (open) {
            setFormData(initialData);
        }
    }, [open, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const handleFieldChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderField = (field: FormField) => {
        const hasError = !!errors[field.name];
        const value = formData[field.name] || '';

        switch (field.type) {
            case 'select':
                return (
                    <Select
                        value={value?.toString() || ''}
                        onValueChange={(val) => handleFieldChange(field.name, val)}
                    >
                        <SelectTrigger className={hasError ? 'border-destructive' : ''}>
                            <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'textarea':
                return (
                    <textarea
                        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${hasError ? 'border-destructive' : ''}`}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                    />
                );

            case 'datetime':
                return (
                    <input
                        type="datetime-local"
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${hasError ? 'border-destructive' : ''}`}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                    />
                );

            default:
                return (
                    <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={hasError ? 'border-destructive' : ''}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {errors.general && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.general}</AlertDescription>
                            </Alert>
                        )}
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-2">
                                <Label htmlFor={field.name}>
                                    {field.label} {field.required && '*'}
                                </Label>
                                {renderField(field)}
                                {errors[field.name] && (
                                    <p className="text-sm text-destructive">{errors[field.name]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {cancelLabel}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
