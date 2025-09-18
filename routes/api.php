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

// User management endpoints
// NOTE: This needs to be moved in a real production environment, but I'm to lazy to do it now :)
Route::get('/users', function () {
    return \App\Models\User::all();
});

Route::post('/users', function (\Illuminate\Http\Request $request) {
    //TODO: This needs to come from the AUTH or user Service
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
    ]);

    return \App\Models\User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => \Illuminate\Support\Facades\Hash::make($request->password),
    ]);
});

Route::put('/users/{id}', function (\Illuminate\Http\Request $request, $id) {
    //TODO: This needs to come from the AUTH or user Service also :)
    $user = \App\Models\User::findOrFail($id);

    $validationRules = [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,' . $id,
    ];

    if ($request->has('password') && $request->password) {
        $validationRules['password'] = 'string|min:8';
    }

    $request->validate($validationRules);

    $updateData = [
        'name' => $request->name,
        'email' => $request->email,
    ];

    if ($request->has('password') && $request->password) {
        $updateData['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
    }

    $user->update($updateData);
    return $user;
});

// Yeah I'll leave this for now, let's hope they don't delete their own account :)
Route::delete('/users/{id}', function ($id) {
    $user = \App\Models\User::findOrFail($id);
    
    // Prevent users from deleting their own account, should be good enough for a demo.
    if (auth()->check() && auth()->id() == $user->id) {
        return response()->json([
            'message' => 'You cannot delete your own account'
        ], 403);
    }
    
    $user->delete();
    return response()->noContent();
});
