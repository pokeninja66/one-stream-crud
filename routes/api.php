<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StreamController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// NOTE: This is a temporary endpoint to get the stream types.
// This needs to be updated in a real production environment to actually use API tokens to the auth system.
// For now, we're just returning all the streams and stream types.

// Stream API Routes
Route::apiResource('streams', StreamController::class);
// Stream Types endpoints
Route::get('/stream-types', function () {
    return \App\Models\StreamType::all();
});

Route::post('/stream-types', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255|unique:stream_types,name',
    ]);
    
    return \App\Models\StreamType::create($request->only('name'));
});

Route::put('/stream-types/{id}', function (\Illuminate\Http\Request $request, $id) {
    $streamType = \App\Models\StreamType::findOrFail($id);
    
    $request->validate([
        'name' => 'required|string|max:255|unique:stream_types,name,' . $id,
    ]);
    
    $streamType->update($request->only('name'));
    return $streamType;
});

Route::delete('/stream-types/{id}', function ($id) {
    $streamType = \App\Models\StreamType::findOrFail($id);
    $streamType->delete();
    return response()->noContent();
});
