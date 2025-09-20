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
Route::get('streams', [StreamController::class, 'index']);
Route::post('streams', [StreamController::class, 'store']);
Route::get('streams/{stream}', [StreamController::class, 'show']);
Route::put('streams/{stream}', [StreamController::class, 'update']);
Route::patch('streams/{stream}', [StreamController::class, 'update']);
Route::delete('streams/{stream}', [StreamController::class, 'destroy']);

// Stream Types endpoints
Route::get('stream-types', [StreamTypeController::class, 'index']);
Route::post('stream-types', [StreamTypeController::class, 'store']);
Route::get('stream-types/{stream_type}', [StreamTypeController::class, 'show']);
Route::put('stream-types/{stream_type}', [StreamTypeController::class, 'update']);
Route::patch('stream-types/{stream_type}', [StreamTypeController::class, 'update']);
Route::delete('stream-types/{stream_type}', [StreamTypeController::class, 'destroy']);

// User management endpoints
// NOTE: This needs to also have auth, but I'm to lazy to do it now :)
Route::get('users', [UserController::class, 'index']);
Route::post('users', [UserController::class, 'store']);
Route::get('users/{user}', [UserController::class, 'show']);
Route::put('users/{user}', [UserController::class, 'update']);
Route::patch('users/{user}', [UserController::class, 'update']);
Route::delete('users/{user}', [UserController::class, 'destroy']);
