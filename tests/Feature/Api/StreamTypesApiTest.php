<?php

use App\Models\StreamType;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Stream Types API Endpoints', function () {
    
    describe('GET /api/stream-types', function () {
        
        test('can list all stream types', function () {
            StreamType::create(['name' => 'Live Stream']);
            StreamType::create(['name' => 'Recorded Video']);
            StreamType::create(['name' => 'Podcast']);
            
            $response = $this->getJson('/api/stream-types');
            
            $response->assertStatus(200)
                ->assertJsonStructure([
                    '*' => [
                        'id',
                        'name',
                        'created_at',
                        'updated_at'
                    ]
                ]);
            
            $this->assertCount(3, $response->json());
        });
        
        test('returns empty array when no stream types exist', function () {
            $response = $this->getJson('/api/stream-types');
            
            $response->assertStatus(200)
                ->assertJson([]);
        });
    });
    
    describe('POST /api/stream-types', function () {
        
        test('can create a new stream type with valid data', function () {
            $streamTypeData = [
                'name' => 'New Stream Type'
            ];
            
            $response = $this->postJson('/api/stream-types', $streamTypeData);
            
            $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'created_at',
                    'updated_at'
                ])
                ->assertJson([
                    'name' => 'New Stream Type'
                ]);
            
            $this->assertDatabaseHas('stream_types', [
                'name' => 'New Stream Type'
            ]);
        });
        
        test('validates required name field', function () {
            $response = $this->postJson('/api/stream-types', []);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
        });
        
        test('validates name is string', function () {
            $response = $this->postJson('/api/stream-types', [
                'name' => 123
            ]);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
        });
        
        test('validates name max length', function () {
            $response = $this->postJson('/api/stream-types', [
                'name' => str_repeat('a', 256) // Too long
            ]);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
        });
        
        test('validates name uniqueness', function () {
            StreamType::create(['name' => 'Existing Type']);
            
            $response = $this->postJson('/api/stream-types', [
                'name' => 'Existing Type'
            ]);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
        });
        
        test('allows duplicate names with different casing', function () {
            StreamType::create(['name' => 'Live Stream']);
            
            $response = $this->postJson('/api/stream-types', [
                'name' => 'live stream' // Different casing
            ]);
            
            $response->assertStatus(201);
        });
    });
    
    describe('PUT /api/stream-types/{id}', function () {
        
        test('can update a stream type with valid data', function () {
            $streamType = StreamType::create(['name' => 'Original Name']);
            
            $updateData = [
                'name' => 'Updated Name'
            ];
            
            $response = $this->putJson("/api/stream-types/{$streamType->id}", $updateData);
            
            $response->assertStatus(200)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'created_at',
                    'updated_at'
                ])
                ->assertJson([
                    'id' => $streamType->id,
                    'name' => 'Updated Name'
                ]);
            
            $this->assertDatabaseHas('stream_types', [
                'id' => $streamType->id,
                'name' => 'Updated Name'
            ]);
        });
        
        test('validates updated name field', function () {
            $streamType = StreamType::create(['name' => 'Original Name']);
            
            $response = $this->putJson("/api/stream-types/{$streamType->id}", [
                'name' => ''
            ]);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
        });
        
        test('validates name uniqueness on update', function () {
            $streamType1 = StreamType::create(['name' => 'Type 1']);
            $streamType2 = StreamType::create(['name' => 'Type 2']);
            
            $response = $this->putJson("/api/stream-types/{$streamType2->id}", [
                'name' => 'Type 1' // Same as streamType1
            ]);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
        });
        
        test('allows keeping same name on update', function () {
            $streamType = StreamType::create(['name' => 'Original Name']);
            
            $response = $this->putJson("/api/stream-types/{$streamType->id}", [
                'name' => 'Original Name' // Same name
            ]);
            
            $response->assertStatus(200);
        });
        
        test('returns 404 for non-existent stream type', function () {
            $response = $this->putJson('/api/stream-types/999', [
                'name' => 'Updated Name'
            ]);
            
            $response->assertStatus(404);
        });
    });
    
    describe('DELETE /api/stream-types/{id}', function () {
        
        test('can delete a stream type', function () {
            $streamType = StreamType::create(['name' => 'To Be Deleted']);
            
            $response = $this->deleteJson("/api/stream-types/{$streamType->id}");
            
            $response->assertStatus(204);
            
            $this->assertDatabaseMissing('stream_types', [
                'id' => $streamType->id
            ]);
        });
        
        test('returns 404 for non-existent stream type', function () {
            $response = $this->deleteJson('/api/stream-types/999');
            
            $response->assertStatus(404);
        });
        
        test('deleted stream type does not appear in listings', function () {
            $streamType = StreamType::create(['name' => 'To Be Deleted']);
            $this->deleteJson("/api/stream-types/{$streamType->id}");
            
            $response = $this->getJson('/api/stream-types');
            
            $response->assertStatus(200);
            $this->assertCount(0, $response->json());
        });
        
        test('deleting stream type with associated streams', function () {
            $streamType = StreamType::create(['name' => 'Type With Streams']);
            
            // Create a stream associated with this type
            \App\Models\Stream::factory()->create([
                'stream_type_id' => $streamType->id
            ]);
            
            $response = $this->deleteJson("/api/stream-types/{$streamType->id}");
            
            // Should still be able to delete (no foreign key constraints)
            $response->assertStatus(204);
            
            $this->assertDatabaseMissing('stream_types', [
                'id' => $streamType->id
            ]);
        });
    });
});
