<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UniversityMember;
use App\Models\Career;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UniversityMemberSeeder extends Seeder
{
    public function run()
    {
        // Asegúrate de que el archivo esté en storage/app/university_data.txt
        if (!Storage::exists('university_data.txt')) {
            $this->command->error('El archivo university_data.txt no existe en storage/app/');
            return;
        }

        $content = Storage::get('university_data.txt');
        $lines = explode("\n", $content);
        
        $currentCareer = null;

        foreach ($lines as $line) {
            $line = trim($line);

            // 1. Detectar Cabecera de Carrera
            // El archivo usa formatos como "CARRERA DE..." o "CARRERA INGENIERIA..."
            if (Str::startsWith(strtoupper($line), 'CARRERA')) {
                // Limpiar el string para obtener el nombre limpio
                $careerNameRaw = str_replace(['CARRERA DE ', 'CARRERA ', ':'], '', strtoupper($line));
                $careerNameRaw = trim($careerNameRaw);

                // Correcciones manuales para typos en tu archivo de texto
                $careerNameRaw = match($careerNameRaw) {
                    'ARQUITECTIURA' => 'ARQUITECTURA',
                    'INGENIERIA CIVIL' => 'INGENIERÍA CIVIL', // Si está pegado "CARRERAINGENIERIA"
                    'INGENIERIA DE MINAS' => 'INGENIERÍA DE MINAS',
                    // Agrega más correcciones si el match falla
                    default => $careerNameRaw
                };

                // Buscar la carrera en la BD (usar ILIKE en Postgres para búsqueda insensible a mayúsculas)
                $currentCareer = Career::where('name', 'ILIKE', "%{$careerNameRaw}%")->first();
                
                if (!$currentCareer) {
                    // Intento de búsqueda más flexible si falla la exacta
                    $parts = explode(' ', $careerNameRaw);
                    if (count($parts) > 1) {
                        $currentCareer = Career::where('name', 'ILIKE', "%{$parts[0]}%{$parts[1]}%")->first();
                    }
                }

                if ($currentCareer) {
                    $this->command->info("Procesando: " . $currentCareer->name);
                } else {
                    // Si no existe, crear la carrera para no detener el proceso.
                    // Si no se encuentra, crear con faculty por defecto para respetar la migración
                    $currentCareer = Career::firstOrCreate([
                        'name' => $careerNameRaw,
                    ], [
                        'faculty' => 'Facultad desconocida'
                    ]);
                    $this->command->info("Creada/Usando carrera: " . $currentCareer->name);
                }
                continue;
            }

            // 2. Procesar filas de estudiantes (formato | N | Nombre | CI |)
            // Verificamos que tenga pipes '|' y que tenga un número (CI)
            if ($currentCareer && str_contains($line, '|') && preg_match('/\d+/', $line)) {
                $parts = array_map('trim', explode('|', $line));
                
                // La estructura usual es: | N | Nombre | CI | Carrera |
                // Indices aproximados después del explode: [0]=>vacio, [1]=>N, [2]=>Nombre, [3]=>CI
                
                if (count($parts) >= 4) {
                    $name = $parts[2];
                    $ci = $parts[3];

                    // Validaciones básicas para asegurar que es un dato real
                    if (!empty($name) && is_numeric($ci)) {
                        UniversityMember::updateOrCreate(
                            ['ci' => $ci], // Evitar duplicados por CI
                            [
                                'full_name' => $name,
                                'career_id' => $currentCareer->id,
                                'type' => 'student' // Por defecto del txt son estudiantes
                            ]
                        );
                    }
                }
            }
        }
    }
}