<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('streams', function () {
        return Inertia::render('streams/index');
    })->name('streams.index');
    
    Route::get('streams/create', function () {
        return Inertia::render('streams/create');
    })->name('streams.create');
    
    Route::get('streams/{id}/edit', function ($id) {
        return Inertia::render('streams/edit', ['streamId' => $id]);
    })->name('streams.edit');
    
    Route::get('stream-types', function () {
        return Inertia::render('stream-types/index');
    })->name('stream-types.index');
    
    Route::get('users', function () {
        return Inertia::render('users/index');
    })->name('users.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
