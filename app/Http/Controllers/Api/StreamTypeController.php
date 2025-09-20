<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StreamType;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Stream Types",
 *     description="Stream type management endpoints"
 * )
 */
class StreamTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     *     path="/api/stream-types",
     *     summary="Get all stream types",
     *     description="Retrieve a list of all available stream types",
     *     tags={"Stream Types"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Music"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        return StreamType::all();
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     *     path="/api/stream-types",
     *     summary="Create a new stream type",
     *     description="Create a new stream type with the given name",
     *     tags={"Stream Types"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Music", description="Name of the stream type")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Stream type created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Music"),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:stream_types,name',
        ]);

        return StreamType::create($request->only('name'));
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Put(
     *     path="/api/stream-types/{id}",
     *     summary="Update a stream type",
     *     description="Update an existing stream type by ID",
     *     tags={"Stream Types"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Stream type ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Updated Music", description="Updated name of the stream type")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Stream type updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Updated Music"),
     *             @OA\Property(property="created_at", type="string", format="date-time"),
     *             @OA\Property(property="updated_at", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Stream type not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\StreamType] 1")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The given data was invalid."),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $streamType = StreamType::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:stream_types,name,' . $id,
        ]);

        $streamType->update($request->only('name'));
        return $streamType;
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     *     path="/api/stream-types/{id}",
     *     summary="Delete a stream type",
     *     description="Delete an existing stream type by ID",
     *     tags={"Stream Types"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Stream type ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=204,
     *         description="Stream type deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Stream type not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No query results for model [App\\Models\\StreamType] 1")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        $streamType = StreamType::findOrFail($id);
        $streamType->delete();
        return response()->noContent();
    }
}
