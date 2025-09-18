<?php

namespace App\Services;

use App\Models\Stream;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StreamService
{
    /**
     * List streams with filtering, ordering, and pagination
     * Supports both simple query params and JSON:API-style filters
     */
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Stream::query()->with('type');

        // Accept both styles: filter[] ( JSON:API-style) and simple query params
        // NOTE: This is a hack to support both styles for now. Not sure if it's allowed to use spatie/laravel-query-builder for this.
        // 
        $search = $filters['search'] 
            ?? $filters['q'] 
            ?? $filters['filter']['search'] 
            ?? null;

        $type = $filters['stream_type_id'] 
            ?? $filters['type'] 
            ?? $filters['filter']['stream_type_id'] 
            ?? null;

        $sort = $filters['sort'] 
            ?? $filters['order_by'] 
            ?? null;

        $dir = $filters['order_dir'] ?? 'asc';

        // Search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Type filter
        if ($type) {
            $query->where('stream_type_id', $type);
        }

        // Sorting
        if ($sort) {
            // Support JSON:API style: sort=-date_expiration
            if (str_starts_with($sort, '-')) {
                $query->orderBy(ltrim($sort, '-'), 'desc');
            } else {
                $query->orderBy($sort, $dir);
            }
        } else {
            // Default ordering by creation date
            $query->orderBy('created_at', 'desc');
        }

        return $query->paginate($perPage);
    }

    /**
     * Create a new stream
     */
    public function create(array $data): Stream
    {
        return Stream::create($data);
    }

    /**
     * Update an existing stream
     */
    public function update(Stream $stream, array $data): Stream
    {
        $stream->update($data);
        return $stream->fresh();
    }

    /**
     * Delete a stream (soft delete)
     */
    public function delete(Stream $stream): void
    {
        $stream->delete();
    }

    /**
     * Find a stream by ID
     */
    public function find(string $id): ?Stream
    {
        return Stream::find($id);
    }
}
