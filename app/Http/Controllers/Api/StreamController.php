<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStreamRequest;
use App\Http\Requests\UpdateStreamRequest;
use App\Http\Resources\StreamResource;
use App\Models\Stream;
use App\Services\StreamService;
use Illuminate\Http\Request;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="One Stream CRUD API",
 *     description="API documentation for the Streams CRUD system"
 * )
 *
 * @OA\Server(
 *     url="http://127.0.0.1:8000",
 *     description="Local development server"
 * )
 *
 * @OA\Tag(
 *     name="Streams",
 *     description="Stream management endpoints"
 * )
 */

class StreamController extends Controller
{
    public function __construct(private StreamService $service) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     *     path="/api/streams",
     *     summary="List streams with filtering and pagination",
     *     description="Retrieve a paginated list of streams with optional filtering and sorting",
     *     tags={"Streams"},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search by title or description (supports both 'search' and 'q' parameters)",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Alternative search parameter",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="stream_type_id",
     *         in="query",
     *         description="Filter by stream type ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Alternative stream type filter",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="order_by",
     *         in="query",
     *         description="Field to order by",
     *         required=false,
     *         @OA\Schema(type="string", enum={"title", "tokens_price", "date_expiration", "created_at"})
     *     ),
     *     @OA\Parameter(
     *         name="order_dir",
     *         in="query",
     *         description="Sort direction",
     *         required=false,
     *         @OA\Schema(type="string", enum={"asc", "desc"})
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         description="JSON:API style sorting (use '-' prefix for descending)",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Number of items per page",
     *         required=false,
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="links", type="object"),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        // Grab all query params (supports both flat and filter[] style)
        $filters = $request->all();
        $perPage = (int) $request->get('per_page', 15);

        $streams = $this->service->list($filters, $perPage);

        return StreamResource::collection($streams);
    }
 
    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     *     path="/api/streams",
     *     summary="Create a new stream",
     *     description="Create a new stream with the provided data",
     *     tags={"Streams"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Stream created successfully",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(type="object")
     *     )
     * )
     */
    public function store(StoreStreamRequest $request)
    {
        $stream = $this->service->create($request->validated());
        return new StreamResource($stream->load('type'));
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     *     path="/api/streams/{id}",
     *     summary="Get a specific stream",
     *     description="Retrieve a single stream by its ID",
     *     tags={"Streams"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Stream UUID",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Stream not found"
     *     )
     * )
     */
    public function show(Stream $stream)
    {
        return new StreamResource($stream->load('type'));
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Put(
     *     path="/api/streams/{id}",
     *     summary="Update a stream",
     *     description="Update an existing stream with the provided data",
     *     tags={"Streams"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Stream UUID",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Stream updated successfully",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Stream not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(type="object")
     *     )
     * )
     */
    public function update(UpdateStreamRequest $request, Stream $stream)
    {
        $updated = $this->service->update($stream, $request->validated());
        return new StreamResource($updated->load('type'));
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     *     path="/api/streams/{id}",
     *     summary="Delete a stream",
     *     description="Soft delete a stream (marks as deleted but doesn't remove from database)",
     *     tags={"Streams"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Stream UUID",
     *         required=true,
     *         @OA\Schema(type="string", format="uuid")
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Stream deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Stream not found"
     *     )
     * )
     */
    public function destroy(Stream $stream)
    {
        $this->service->delete($stream);
        return response()->noContent();
    }
}

/**
 * @OA\Schema(
 *     schema="Stream",
 *     type="object",
 *     title="Stream",
 *     description="A stream resource",
 *     @OA\Property(property="id", type="string", format="uuid", description="Unique identifier"),
 *     @OA\Property(property="title", type="string", maxLength=255, description="Stream title"),
 *     @OA\Property(property="description", type="string", maxLength=655, description="Stream description"),
 *     @OA\Property(property="tokens_price", type="integer", minimum=1, description="Price in tokens"),
 *     @OA\Property(property="type", ref="#/components/schemas/StreamType"),
 *     @OA\Property(property="date_expiration", type="string", format="date-time", description="Expiration date"),
 *     @OA\Property(property="created_at", type="string", format="date-time", description="Creation timestamp"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", description="Last update timestamp")
 * )
 *
 * @OA\Schema(
 *     schema="StreamType",
 *     type="object",
 *     title="Stream Type",
 *     description="A stream type resource",
 *     @OA\Property(property="id", type="integer", description="Type identifier"),
 *     @OA\Property(property="name", type="string", description="Type name")
 * )
 *
 * @OA\Schema(
 *     schema="StreamInput",
 *     type="object",
 *     title="Stream Input",
 *     description="Input data for creating/updating a stream",
 *     required={"title", "tokens_price", "date_expiration"},
 *     @OA\Property(property="title", type="string", maxLength=255, description="Stream title"),
 *     @OA\Property(property="description", type="string", maxLength=655, description="Stream description"),
 *     @OA\Property(property="tokens_price", type="integer", minimum=1, description="Price in tokens"),
 *     @OA\Property(property="stream_type_id", type="integer", description="Stream type ID"),
 *     @OA\Property(property="date_expiration", type="string", format="date-time", description="Expiration date (Y-m-d H:i:s)")
 * )
 *
 * @OA\Schema(
 *     schema="PaginationLinks",
 *     type="object",
 *     title="Pagination Links",
 *     description="Pagination navigation links",
 *     @OA\Property(property="first", type="string", description="First page URL"),
 *     @OA\Property(property="last", type="string", description="Last page URL"),
 *     @OA\Property(property="prev", type="string", nullable=true, description="Previous page URL"),
 *     @OA\Property(property="next", type="string", nullable=true, description="Next page URL")
 * )
 *
 * @OA\Schema(
 *     schema="PaginationMeta",
 *     type="object",
 *     title="Pagination Meta",
 *     description="Pagination metadata",
 *     @OA\Property(property="current_page", type="integer", description="Current page number"),
 *     @OA\Property(property="from", type="integer", nullable=true, description="First item number"),
 *     @OA\Property(property="last_page", type="integer", description="Last page number"),
 *     @OA\Property(property="per_page", type="integer", description="Items per page"),
 *     @OA\Property(property="to", type="integer", nullable=true, description="Last item number"),
 *     @OA\Property(property="total", type="integer", description="Total number of items")
 * )
 *
 * @OA\Schema(
 *     schema="ValidationError",
 *     type="object",
 *     title="Validation Error",
 *     description="Validation error response",
 *     @OA\Property(property="message", type="string", description="Error message"),
 *     @OA\Property(property="errors", type="object", description="Field-specific errors")
 * )
 */
