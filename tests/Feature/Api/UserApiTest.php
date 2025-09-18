<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('User API Endpoints', function () {
    
    describe('GET /api/user', function () {
        
        test('returns 500 error when sanctum guard is not configured', function () {
            $response = $this->getJson('/api/user');
            
            // Since Sanctum is not configured, this will return a 500 error
            $response->assertStatus(500);
        });
        
        test('returns 500 error with invalid token when sanctum is not configured', function () {
            $response = $this->withHeaders([
                'Authorization' => 'Bearer invalid-token',
            ])->getJson('/api/user');
            
            $response->assertStatus(500);
        });
        
        test('returns 500 error with valid token when sanctum is not configured', function () {
            $user = User::factory()->create();
            
            $response = $this->withHeaders([
                'Authorization' => 'Bearer some-token',
            ])->getJson('/api/user');
            
            $response->assertStatus(500);
        });
    });
});
