import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem, type StreamType } from '@/types';
import { ArrowLeft, Save, LoaderCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { toast } from 'sonner';

interface StreamFormProps {
    stream?: {
        id: string;
        title: string;
        description: string | null;
        tokens_price: number;
        stream_type_id: number | null;
        date_expiration: string;
    };
}

export default function StreamForm({ stream }: StreamFormProps) {
    const [formData, setFormData] = useState({
        title: stream?.title || '',
        description: stream?.description || '',
        tokens_price: stream?.tokens_price || 1,
        stream_type_id: stream?.stream_type_id || undefined,
        date_expiration: stream?.date_expiration ? stream.date_expiration.slice(0, 16) : '',
    });
    const [streamTypes, setStreamTypes] = useState<StreamType[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Streams', href: '/streams' },
        { title: stream ? 'Edit Stream' : 'Create Stream', href: '#' },
    ];

    const fetchStreamTypes = async () => {
        try {
            const response = await fetch('/api/stream-types');
            if (response.ok) {
                const data = await response.json();
                setStreamTypes(data);
            }
        } catch (err) {
            console.error('Failed to fetch stream types:', err);
        }
    };

    // Fetch stream types
    useEffect(() => {
        fetchStreamTypes();
    }, []);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 255) {
            newErrors.title = 'Title must be less than 255 characters';
        }

        if (formData.description && formData.description.length > 655) {
            newErrors.description = 'Description must be less than 655 characters';
        }

        if (!formData.tokens_price || formData.tokens_price < 1) {
            newErrors.tokens_price = 'Tokens price must be at least 1';
        }

        if (!formData.date_expiration) {
            newErrors.date_expiration = 'Expiration date is required';
        } else {
            const expirationDate = new Date(formData.date_expiration);
            const now = new Date();
            if (expirationDate <= now) {
                newErrors.date_expiration = 'Expiration date must be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const url = stream ? `/api/streams/${stream.id}` : '/api/streams';
            const method = stream ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    date_expiration: new Date(formData.date_expiration).toISOString().slice(0, 19).replace('T', ' '),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors) {
                    setErrors(errorData.errors);
                    toast.error('Validation errors occurred');
                } else {
                    const errorMessage = errorData.message || 'An error occurred';
                    setErrors({ general: errorMessage });
                    toast.error(errorMessage);
                }
                return;
            }

            // Redirect to streams list on success
            toast.success(stream ? 'Stream updated successfully!' : 'Stream created successfully!');
            router.visit('/streams');
        } catch (err) {
            const errorMessage = 'An error occurred while saving the stream';
            setErrors({ general: errorMessage });
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={stream ? 'Edit Stream' : 'Create Stream'} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit('/streams')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Streams
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {stream ? 'Edit Stream' : 'Create Stream'}
                        </h1>
                        <p className="text-muted-foreground">
                            {stream ? 'Update stream information' : 'Add a new stream to your collection'}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Stream Information</CardTitle>
                        <CardDescription>
                            Fill in the details for your stream
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.general && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.general}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter stream title"
                                    className={errors.title ? 'border-destructive' : ''}
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Enter stream description (optional)"
                                    rows={4}
                                    className={errors.description ? 'border-destructive' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tokens_price">Tokens Price *</Label>
                                    <Input
                                        id="tokens_price"
                                        type="number"
                                        min="1"
                                        value={formData.tokens_price}
                                        onChange={(e) => handleInputChange('tokens_price', parseInt(e.target.value) || 1)}
                                        placeholder="Enter price in tokens"
                                        className={errors.tokens_price ? 'border-destructive' : ''}
                                    />
                                    {errors.tokens_price && (
                                        <p className="text-sm text-destructive">{errors.tokens_price}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stream_type_id">Stream Type</Label>
                                    <Select
                                        value={formData.stream_type_id?.toString() || 'none'}
                                        onValueChange={(value) => handleInputChange('stream_type_id', value === 'none' ? undefined : parseInt(value))}
                                    >
                                        <SelectTrigger className={errors.stream_type_id ? 'border-destructive' : ''}>
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
                                    {errors.stream_type_id && (
                                        <p className="text-sm text-destructive">{errors.stream_type_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_expiration">Expiration Date *</Label>
                                <DateTimePicker
                                    value={formData.date_expiration}
                                    onChange={(value) => handleInputChange('date_expiration', value)}
                                    placeholder="Select expiration date and time"
                                    className={errors.date_expiration ? 'border-destructive' : ''}
                                />
                                {errors.date_expiration && (
                                    <p className="text-sm text-destructive">{errors.date_expiration}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    <Save className="mr-2 h-4 w-4" />
                                    {stream ? 'Update Stream' : 'Create Stream'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/streams')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
