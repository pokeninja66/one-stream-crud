<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StreamType;

class StreamTypesSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'Sports',
            'E-Book',
            'Podcast',
            'Arts',
            'Music',
        ];

        foreach ($types as $type) {
            StreamType::firstOrCreate(['name' => $type]);
        }
    }
}
