<?php

namespace Database\Factories;

use App\Models\StreamType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StreamType>
 */
class StreamTypeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = StreamType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
        ];
    }

    /**
     * Create common stream types.
     */
    public function liveStream(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Live Stream',
        ]);
    }

    public function recordedVideo(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Recorded Video',
        ]);
    }

    public function podcast(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Podcast',
        ]);
    }
}
