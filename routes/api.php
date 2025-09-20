<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StreamController;
use App\Http\Controllers\Api\StreamTypeController;
use App\Http\Controllers\Api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// NOTE: This is a temporary endpoint to get the stream types.
// This needs to be updated in a real production environment to actually use API tokens to the auth system.
// For now, we're just returning all the streams and stream types.

// Stream API Routes
Route::apiResource('streams', StreamController::class);
// Stream Types endpoints
Route::apiResource('stream-types', StreamTypeController::class);

// User management endpoints
// NOTE: This needs to also have auth, but I'm to lazy to do it now :)
Route::apiResource('users', UserController::class);
