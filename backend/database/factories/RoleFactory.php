<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    public function definition(): array
    {
        $name = Str::slug($this->faker->unique()->jobTitle());

        return [
            'name' => $name,
            'display_name' => ucfirst($name),
            'dashboard_route' => '/dashboard/' . $name,
        ];
    }
}
