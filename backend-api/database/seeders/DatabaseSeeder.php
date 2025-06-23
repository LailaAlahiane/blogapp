<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Créer l'utilisateur de test seulement s'il n'existe pas déjà
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'), // Assurez-vous d'avoir un mot de passe par défaut si vous utilisez firstOrCreate
            ]
        );

        $this->call([
            ArticleSeeder::class,
        ]);
    }
}
