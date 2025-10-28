<?php

namespace Tests\Feature;

use Database\Seeders\DocenteModuleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class BecaTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_becas(): void
    {
        $this->seed(DocenteModuleSeeder::class);

        $response = $this->getJson('/api/becas');

        $response
            ->assertOk()
            ->assertJsonStructure([
                ['id', 'codigo', 'fecha_inicio', 'estado', 'becario' => ['id', 'nombre'], 'tutor' => ['id', 'nombre']],
            ])
            ->assertJsonCount(3);
    }

    public function test_can_filter_becas_by_tutor(): void
    {
        $this->seed(DocenteModuleSeeder::class);

        $tutorId = DB::table('users')->where('username', 'samuel')->value('id');

        $response = $this->getJson('/api/becas?tutor_id=' . $tutorId);

        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.tutor.id', $tutorId)
            ->assertJsonPath('0.tutor.nombre', 'Samuel Evaluador');
    }

    public function test_can_create_update_and_delete_beca(): void
    {
        $this->seed(DocenteModuleSeeder::class);

        $becarioId = DB::table('users')->where('username', 'becario')->value('id');
        $tutorId = DB::table('users')->where('username', 'samuel')->value('id');

        $createResponse = $this->postJson('/api/becas', [
            'codigo' => 'BAI-2025-005',
            'becario_id' => $becarioId,
            'tutor_id' => $tutorId,
            'fecha_inicio' => '2025-01-10',
            'estado' => 'Activa',
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonFragment([
                'codigo' => 'BAI-2025-005',
                'estado' => 'Activa',
            ]);

        $becaId = $createResponse->json('id');

        $updateResponse = $this->putJson('/api/becas/' . $becaId, [
            'codigo' => 'BAI-2025-005',
            'becario_id' => $becarioId,
            'tutor_id' => $tutorId,
            'fecha_inicio' => '2025-02-01',
            'estado' => 'En evaluación',
        ]);

        $updateResponse
            ->assertOk()
            ->assertJsonFragment([
                'id' => $becaId,
                'estado' => 'En evaluación',
            ]);

        $this->assertDatabaseHas('becas', [
            'id' => $becaId,
            'fecha_inicio' => Carbon::parse('2025-02-01')->format('Y-m-d 00:00:00'),
            'estado' => 'En evaluación',
        ]);

        $deleteResponse = $this->deleteJson('/api/becas/' . $becaId);
        $deleteResponse->assertNoContent();

        $this->assertDatabaseMissing('becas', ['id' => $becaId]);
    }
}
