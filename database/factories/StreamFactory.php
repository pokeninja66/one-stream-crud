<?php

namespace Database\Factories;

use App\Models\Stream;
use App\Models\StreamType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stream>
 */
class StreamFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Stream::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'tokens_price' => $this->faker->numberBetween(1, 1000),
            'stream_type_id' => StreamType::factory(),
            'date_expiration' => $this->faker->dateTimeBetween('now', '+30 days'),
        ];
    }

    /**
     * Indicate that the stream has no type.
     */
    public function withoutType(): static
    {
        return $this->state(fn (array $attributes) => [
            'stream_type_id' => null,
        ]);
    }

    /**
     * Indicate that the stream has a specific type.
     */
    public function withType(StreamType $type): static
    {
        return $this->state(fn (array $attributes) => [
            'stream_type_id' => $type->id,
        ]);
    }

    /**
     * Indicate that the stream has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_expiration' => $this->faker->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    /**
     * Indicate that the stream expires soon.
     */
    public function expiringSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'date_expiration' => $this->faker->dateTimeBetween('now', '+1 day'),
        ]);
    }
}
