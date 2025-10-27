<?php

namespace Tests\Feature;

use Database\Seeders\DocenteModuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_receive_dashboard_route(): void
    {
        $this->seed(DocenteModuleSeeder::class);

        $response = $this->postJson('/api/login', [
            'username' => 'tutor',
            'password' => 'password123',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'role' => 'tutor',
                'dashboardRoute' => '/dashboard/tutor',
            ])
            ->assertJsonStructure([
                'id',
                'name',
                'username',
                'role',
                'roleLabel',
                'dashboardRoute',
            ]);
    }

    public function test_invalid_credentials_return_validation_error(): void
    {
        $this->seed(DocenteModuleSeeder::class);

        $response = $this->postJson('/api/login', [
            'username' => 'tutor',
            'password' => 'wrong-password',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['username']);
    }
}
