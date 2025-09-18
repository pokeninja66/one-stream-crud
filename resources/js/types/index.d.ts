import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface StreamType {
    id: number;
    name: string;
}

export interface Stream {
    id: string;
    title: string;
    description: string | null;
    tokens_price: number;
    type: StreamType | null;
    date_expiration: string;
    created_at: string;
    updated_at: string;
}

export interface StreamFilters {
    search?: string;
    q?: string;
    stream_type_id?: number;
    type?: number;
    order_by?: string;
    order_dir?: 'asc' | 'desc';
    sort?: string;
    per_page?: number;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface StreamsResponse {
    data: Stream[];
    links: PaginationLinks;
    meta: PaginationMeta;
}
