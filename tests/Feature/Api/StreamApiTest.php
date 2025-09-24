<?php

use App\Models\Stream;
use App\Models\StreamType;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create some test stream types
    $this->streamType1 = StreamType::create(['name' => 'Live Stream']);
    $this->streamType2 = StreamType::create(['name' => 'Recorded Video']);
});

describe('Stream API Endpoints', function () {
    
    describe('GET /api/streams', function () {
        
        test('can list all streams', function () {
            // Create test streams
            Stream::factory()->count(3)->create();
            
            $response = $this->getJson('/api/streams');
            
            $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'description',
                            'tokens_price',
                            'type',
                            'date_expiration',
                            'created_at',
                            'updated_at'
                        ]
                    ],
                    'links',
                    'meta'
                ]);
            
            $this->assertCount(3, $response->json('data'));
        });
        
        test('can filter streams by search query', function () {
            Stream::factory()->create(['title' => 'Gaming Stream']);
            Stream::factory()->create(['title' => 'Music Concert']);
            Stream::factory()->create(['description' => 'Cooking tutorial']);
            
            $response = $this->getJson('/api/streams?search=Gaming');
            
            $response->assertStatus(200);
            $this->assertCount(1, $response->json('data'));
            $this->assertEquals('Gaming Stream', $response->json('data.0.title'));
        });
        
        test('can filter streams by stream type', function () {
            Stream::factory()->create(['stream_type_id' => $this->streamType1->id]);
            Stream::factory()->create(['stream_type_id' => $this->streamType2->id]);
            Stream::factory()->create(['stream_type_id' => null]);
            
            $response = $this->getJson("/api/streams?stream_type_id={$this->streamType1->id}");
            
            $response->assertStatus(200);
            $this->assertCount(1, $response->json('data'));
            $this->assertEquals($this->streamType1->id, $response->json('data.0.type.id'));
        });
        
        test('can sort streams by different fields', function () {
            $stream1 = Stream::factory()->create(['title' => 'Alpha Stream', 'tokens_price' => 100]);
            $stream2 = Stream::factory()->create(['title' => 'Beta Stream', 'tokens_price' => 200]);
            
            $response = $this->getJson('/api/streams?order_by=title&order_dir=asc');
            
            $response->assertStatus(200);
            $this->assertEquals('Alpha Stream', $response->json('data.0.title'));
            $this->assertEquals('Beta Stream', $response->json('data.1.title'));
        });
        
        test('can paginate streams', function () {
            Stream::factory()->count(25)->create();
            
            $response = $this->getJson('/api/streams?per_page=10');
            
            $response->assertStatus(200);
            $this->assertCount(10, $response->json('data'));
            $this->assertEquals(25, $response->json('meta.total'));
            $this->assertEquals(3, $response->json('meta.last_page'));
        });
        
        test('supports JSON:API style sorting', function () {
            $stream1 = Stream::factory()->create(['tokens_price' => 100]);
            $stream2 = Stream::factory()->create(['tokens_price' => 200]);
            
            $response = $this->getJson('/api/streams?sort=-tokens_price');
            
            $response->assertStatus(200);
            $this->assertEquals(200, $response->json('data.0.tokens_price'));
            $this->assertEquals(100, $response->json('data.1.tokens_price'));
        });
    });
    
    describe('POST /api/streams', function () {
        
        test('can create a new stream with valid data', function () {
            $streamData = [
                'title' => 'Test Stream',
                'description' => 'This is a test stream',
                'tokens_price' => 150,
                'stream_type_id' => $this->streamType1->id,
                'date_expiration' => now()->addDays(7)->format('Y-m-d H:i:s')
            ];
            
            $response = $this->postJson('/api/streams', $streamData);
            
            $response->assertStatus(201)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'title',
                        'description',
                        'tokens_price',
                        'type',
                        'date_expiration',
                        'created_at',
                        'updated_at'
                    ]
                ]);
            
            $this->assertDatabaseHas('streams', [
                'title' => 'Test Stream',
                'tokens_price' => 150,
                'stream_type_id' => $this->streamType1->id
            ]);
        });
        
        test('validates required fields', function () {
            $response = $this->postJson('/api/streams', []);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['title', 'tokens_price', 'date_expiration']);
        });
        
        test('validates title max length', function () {
            $streamData = [
                'title' => str_repeat('a', 256), // Too long
                'tokens_price' => 100,
                'date_expiration' => now()->addDays(7)->format('Y-m-d H:i:s')
            ];
            
            $response = $this->postJson('/api/streams', $streamData);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['title']);
        });
        
        test('validates tokens_price minimum value', function () {
            $streamData = [
                'title' => 'Test Stream',
                'tokens_price' => 0, // Too low
                'date_expiration' => now()->addDays(7)->format('Y-m-d H:i:s')
            ];
            
            $response = $this->postJson('/api/streams', $streamData);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['tokens_price']);
        });
        
        test('validates date_expiration is in future', function () {
            $streamData = [
                'title' => 'Test Stream',
                'tokens_price' => 100,
                'date_expiration' => now()->subDays(1)->format('Y-m-d H:i:s') // Past date
            ];
            
            $response = $this->postJson('/api/streams', $streamData);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['date_expiration']);
        });
        
        test('validates stream_type_id exists', function () {
            $streamData = [
                'title' => 'Test Stream',
                'tokens_price' => 100,
                'stream_type_id' => 999, // Non-existent ID
                'date_expiration' => now()->addDays(7)->format('Y-m-d H:i:s')
            ];
            
            $response = $this->postJson('/api/streams', $streamData);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['stream_type_id']);
        });
        
        test('can create stream without optional fields', function () {
            $streamData = [
                'title' => 'Minimal Stream',
                'tokens_price' => 50,
                'date_expiration' => now()->addDays(1)->format('Y-m-d H:i:s')
            ];
            
            $response = $this->postJson('/api/streams', $streamData);
            
            $response->assertStatus(201);
            $this->assertDatabaseHas('streams', [
                'title' => 'Minimal Stream',
                'description' => null,
                'stream_type_id' => null
            ]);
        });

        test('preserves exact date_expiration without timezone shift', function () {
            $target = now()->setTimezone('Europe/Sofia')->addDays(2)->setSeconds(30);
            $payload = [
                'title' => 'Datetime Integrity',
                'tokens_price' => 10,
                'date_expiration' => $target->format('Y-m-d H:i:s'),
            ];

            $response = $this->postJson('/api/streams', $payload)->assertStatus(201);

            $id = $response->json('data.id');
            $this->assertNotEmpty($id);

            $get = $this->getJson("/api/streams/{$id}")->assertStatus(200);
            $this->assertEquals($payload['date_expiration'], $get->json('data.date_expiration'));
        });

        test('rejects wrong date format and accepts correct one', function () {
            $bad = [
                'title' => 'Bad Date',
                'tokens_price' => 1,
                'date_expiration' => now()->addDay()->toIso8601String(),
            ];
            $this->postJson('/api/streams', $bad)
                ->assertStatus(422)
                ->assertJsonValidationErrors(['date_expiration']);

            $good = [
                'title' => 'Good Date',
                'tokens_price' => 1,
                'date_expiration' => now()->addDay()->format('Y-m-d H:i:s'),
            ];
            $this->postJson('/api/streams', $good)->assertStatus(201);
        });
    });
    
    describe('GET /api/streams/{id}', function () {
        
        test('can show a specific stream', function () {
            $stream = Stream::factory()->create([
                'stream_type_id' => $this->streamType1->id
            ]);
            
            $response = $this->getJson("/api/streams/{$stream->id}");
            
            $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'title',
                        'description',
                        'tokens_price',
                        'type',
                        'date_expiration',
                        'created_at',
                        'updated_at'
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'id' => $stream->id,
                        'title' => $stream->title,
                        'tokens_price' => $stream->tokens_price
                    ]
                ]);
        });
        
        test('returns 404 for non-existent stream', function () {
            $response = $this->getJson('/api/streams/00000000-0000-0000-0000-000000000000');
            
            $response->assertStatus(404);
        });
        
        test('returns 404 for invalid UUID format', function () {
            $response = $this->getJson('/api/streams/invalid-id');
            
            $response->assertStatus(404);
        });
    });
    
    describe('PUT /api/streams/{id}', function () {
        
        test('can update a stream with valid data', function () {
            $stream = Stream::factory()->create([
                'title' => 'Original Title',
                'tokens_price' => 100,
                'stream_type_id' => $this->streamType1->id
            ]);
            
            $updateData = [
                'title' => 'Updated Title',
                'description' => 'Updated description',
                'tokens_price' => 200,
                'stream_type_id' => $this->streamType2->id,
                'date_expiration' => now()->addDays(14)->format('Y-m-d H:i:s')
            ];
            
            $response = $this->putJson("/api/streams/{$stream->id}", $updateData);
            
            $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'id' => $stream->id,
                        'title' => 'Updated Title',
                        'description' => 'Updated description',
                        'tokens_price' => 200,
                        'type' => [
                            'id' => $this->streamType2->id,
                            'name' => $this->streamType2->name
                        ]
                    ]
                ]);
            
            $this->assertDatabaseHas('streams', [
                'id' => $stream->id,
                'title' => 'Updated Title',
                'tokens_price' => 200,
                'stream_type_id' => $this->streamType2->id
            ]);
        });
        
        test('can partially update a stream', function () {
            $stream = Stream::factory()->create([
                'title' => 'Original Title',
                'tokens_price' => 100
            ]);
            
            $updateData = [
                'title' => 'Updated Title Only'
            ];
            
            $response = $this->putJson("/api/streams/{$stream->id}", $updateData);
            
            $response->assertStatus(200)
                ->assertJson([
                    'data' => [
                        'id' => $stream->id,
                        'title' => 'Updated Title Only',
                        'tokens_price' => 100 // Should remain unchanged
                    ]
                ]);
        });
        
        test('validates updated data', function () {
            $stream = Stream::factory()->create();
            
            $updateData = [
                'title' => '', // Empty title
                'tokens_price' => -1 // Invalid price
            ];
            
            $response = $this->putJson("/api/streams/{$stream->id}", $updateData);
            
            $response->assertStatus(422)
                ->assertJsonValidationErrors(['title', 'tokens_price']);
        });
        
        test('returns 404 for non-existent stream', function () {
            $updateData = ['title' => 'Updated Title'];
            
            $response = $this->putJson('/api/streams/00000000-0000-0000-0000-000000000000', $updateData);
            
            $response->assertStatus(404);
        });
    });
    
    describe('DELETE /api/streams/{id}', function () {
        
        test('can delete a stream', function () {
            $stream = Stream::factory()->create();
            
            $response = $this->deleteJson("/api/streams/{$stream->id}");
            
            $response->assertStatus(204);
            
            // Check that stream is soft deleted
            $this->assertSoftDeleted('streams', ['id' => $stream->id]);
        });
        
        test('returns 404 for non-existent stream', function () {
            $response = $this->deleteJson('/api/streams/00000000-0000-0000-0000-000000000000');
            
            $response->assertStatus(404);
        });
        
        test('deleted stream does not appear in listings', function () {
            $stream = Stream::factory()->create();
            $this->deleteJson("/api/streams/{$stream->id}");
            
            $response = $this->getJson('/api/streams');
            
            $response->assertStatus(200);
            $this->assertCount(0, $response->json('data'));
        });
    });
});
