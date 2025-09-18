<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStreamRequest;
use App\Http\Requests\UpdateStreamRequest;
use App\Http\Resources\StreamResource;
use App\Models\Stream;
use App\Services\StreamService;
use Illuminate\Http\Request;

class StreamController extends Controller
{
    public function __construct(private StreamService $service) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['q', 'type', 'order_by', 'order_dir']);
        $perPage = (int) $request->get('per_page', 15);

        $streams = $this->service->list($filters, $perPage);
        return StreamResource::collection($streams);
    }
 
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStreamRequest $request)
    {
        $stream = $this->service->create($request->validated());
        return new StreamResource($stream->load('type'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Stream $stream)
    {
        return new StreamResource($stream->load('type'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStreamRequest $request, Stream $stream)
    {
        $updated = $this->service->update($stream, $request->validated());
        return new StreamResource($updated->load('type'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stream $stream)
    {
        $this->service->delete($stream);
        return response()->noContent();
    }
}
