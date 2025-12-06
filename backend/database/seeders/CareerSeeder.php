<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Career;

class CareerSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'Facultad Ingeniería y Tecnología' => [
                'Ingeniería de Procesos de Materias Primas Minerales',
                'Ingeniería Civil',
                'Ingeniería Eléctrica',
                'Ingeniería Electrónica',
                'Ingeniería Mecánica',
                'Ingeniería Mecatrónica',
                'Ingeniería Minera', // Nota: En las tablas de alumnos aparece como Ingeniería de Minas
                'Ingeniería de Sistemas', // Nota: Simplificado de "Ingeniería de Sistemas / Informática" para coincidir con las tablas de alumnos [cite: 222]
                'Ingeniería Ambiental',
                'Construcciones Civiles', // (nivel técnico/licenciatura)
                'Mecánica Automotriz',    // (nivel técnico/licenciatura)
                'Ingeniería Industrial',  // Agregado porque aparece en las tablas de alumnos [cite: 36]
                'Ingeniería Geológica',   // Agregado porque aparece en las tablas de alumnos [cite: 66]
                'Agronomía'               // Agregado porque aparece en las tablas de alumnos [cite: 45]
            ],
            'Facultad Ciencias Económicas y Sociales' => [
                'Administración de Empresas',
                'Contaduría Pública', // Simplificado para coincidir con tablas [cite: 273]
                'Economía',
                'Ingeniería Comercial',
                'Derecho',
                'Comunicación Social', // Simplificado para coincidir con tablas [cite: 365]
                'Trabajo Social',
                'Turismo',
                'Lingüística e Idiomas'
            ],
            'Facultad Salud y Ciencias Naturales' => [
                'Medicina',
                'Enfermería',
                'Química',
                'Física',
                'Matemática', // Nota: En tablas a veces aparece como Matemáticas
                'Estadística',
                'Odontología' // Agregado porque aparece en las tablas de alumnos [cite: 399]
            ],
            'Facultad Artes y Humanidades' => [
                'Arquitectura',
                'Artes Musicales',
                'Artes Plásticas'
            ]
        ];

        foreach ($data as $faculty => $careers) {
            foreach ($careers as $careerName) {
                Career::create([
                    'faculty' => $faculty,
                    'name'    => $careerName
                ]);
            }
        }
    }
}