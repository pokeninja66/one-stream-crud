<?php

namespace App\Services;

use App\Models\Stream;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StreamService
{
    /**
     * List streams with filtering, ordering, and pagination
     */
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Stream::query()->with('type');

        // Search filter
        if (!empty($filters['q'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['q'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['q'] . '%');
            });
        }

        // Type filter
        if (!empty($filters['type'])) {
            $query->where('stream_type_id', $filters['type']);
        }

        // Ordering
        if (!empty($filters['order_by'])) {
            $direction = $filters['order_dir'] ?? 'asc';
            $query->orderBy($filters['order_by'], $direction);
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
