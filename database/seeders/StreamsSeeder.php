<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stream;
use App\Models\StreamType;

class StreamsSeeder extends Seeder
{
    public function run(): void
    {
        // Get all stream types for random assignment
        $streamTypes = StreamType::all();
        
        // Create 10 sample streams with varied data
        $streams = [
            [
                'title' => 'Live Football Match: Barcelona vs Real Madrid',
                'description' => 'Watch the epic El Clasico match live with expert commentary and analysis.',
                'tokens_price' => 150,
                'stream_type_id' => $streamTypes->where('name', 'Sports')->first()?->id,
                'date_expiration' => now()->addDays(3)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Complete Guide to Laravel Development',
                'description' => 'A comprehensive e-book covering Laravel from basics to advanced topics including testing, deployment, and best practices.',
                'tokens_price' => 200,
                'stream_type_id' => $streamTypes->where('name', 'E-Book')->first()?->id,
                'date_expiration' => now()->addDays(30)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Tech Talk: Future of AI',
                'description' => 'Join industry experts as they discuss the latest trends and future implications of artificial intelligence.',
                'tokens_price' => 75,
                'stream_type_id' => $streamTypes->where('name', 'Podcast')->first()?->id,
                'date_expiration' => now()->addDays(7)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Digital Art Masterclass',
                'description' => 'Learn advanced digital art techniques from professional artists. Perfect for beginners and intermediate artists.',
                'tokens_price' => 120,
                'stream_type_id' => $streamTypes->where('name', 'Arts')->first()?->id,
                'date_expiration' => now()->addDays(14)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Jazz Concert: Miles Davis Tribute',
                'description' => 'Experience the magic of jazz with this exclusive tribute concert featuring renowned musicians.',
                'tokens_price' => 180,
                'stream_type_id' => $streamTypes->where('name', 'Music')->first()?->id,
                'date_expiration' => now()->addDays(2)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Championship Boxing: Heavyweight Title Fight',
                'description' => 'Don\'t miss this epic heavyweight championship bout with pre-fight analysis and post-fight interviews.',
                'tokens_price' => 250,
                'stream_type_id' => $streamTypes->where('name', 'Sports')->first()?->id,
                'date_expiration' => now()->addDays(1)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'React.js Complete Course',
                'description' => 'Master React.js with this comprehensive course covering hooks, context, state management, and modern patterns.',
                'tokens_price' => 300,
                'stream_type_id' => $streamTypes->where('name', 'E-Book')->first()?->id,
                'date_expiration' => now()->addDays(60)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Startup Stories Podcast',
                'description' => 'Listen to inspiring stories from successful entrepreneurs and learn valuable lessons for your own journey.',
                'tokens_price' => 50,
                'stream_type_id' => $streamTypes->where('name', 'Podcast')->first()?->id,
                'date_expiration' => now()->addDays(21)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Watercolor Painting Workshop',
                'description' => 'Join this interactive watercolor workshop and create beautiful landscapes with step-by-step guidance.',
                'tokens_price' => 90,
                'stream_type_id' => $streamTypes->where('name', 'Arts')->first()?->id,
                'date_expiration' => now()->addDays(10)->format('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Classical Symphony Orchestra Performance',
                'description' => 'Enjoy a magnificent classical music performance by the world-renowned symphony orchestra.',
                'tokens_price' => 220,
                'stream_type_id' => $streamTypes->where('name', 'Music')->first()?->id,
                'date_expiration' => now()->addDays(5)->format('Y-m-d H:i:s'),
            ],
        ];

        foreach ($streams as $streamData) {
            Stream::firstOrCreate(
                ['title' => $streamData['title']],
                $streamData
            );
        }
    }
}
