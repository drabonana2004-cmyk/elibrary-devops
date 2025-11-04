<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestBooksSeeder extends Seeder
{
    public function run()
    {
        // Créer les catégories d'abord
        $categories = [
            ['name' => 'Fiction', 'description' => 'Romans et nouvelles'],
            ['name' => 'Science-Fiction', 'description' => 'Science-fiction et fantasy'],
            ['name' => 'Histoire', 'description' => 'Livres d\'histoire'],
            ['name' => 'Philosophie', 'description' => 'Ouvrages philosophiques'],
            ['name' => 'Informatique', 'description' => 'Livres techniques'],
            ['name' => 'Romance', 'description' => 'Romans d\'amour'],
            ['name' => 'Thriller', 'description' => 'Suspense et thriller'],
            ['name' => 'Biographie', 'description' => 'Biographies et autobiographies'],
            ['name' => 'Jeunesse', 'description' => 'Livres pour enfants et adolescents'],
            ['name' => 'Essais', 'description' => 'Essais et analyses']
        ];

        foreach ($categories as $category) {
            DB::table('categories')->updateOrInsert(
                ['name' => $category['name']],
                $category + ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // Récupérer les IDs des catégories
        $categoryIds = DB::table('categories')->pluck('id', 'name');

        // Créer les livres de test
        $books = [
            [
                'title' => 'Le Petit Prince',
                'author' => 'Antoine de Saint-Exupéry',
                'isbn' => '9782070408504',
                'category_id' => $categoryIds['Fiction'],
                'quantity' => 5,
                'available_quantity' => 5,
                'description' => 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.'
            ],
            [
                'title' => 'Dune',
                'author' => 'Frank Herbert',
                'isbn' => '9782266320580',
                'category_id' => $categoryIds['Science-Fiction'],
                'quantity' => 3,
                'available_quantity' => 3,
                'description' => 'Une épopée de science-fiction dans un univers désertique lointain.'
            ],
            [
                'title' => 'L\'Histoire de France',
                'author' => 'Ernest Lavisse',
                'isbn' => '9782253906827',
                'category_id' => $categoryIds['Histoire'],
                'quantity' => 4,
                'available_quantity' => 4,
                'description' => 'Une histoire complète de la France des origines à nos jours.'
            ],
            [
                'title' => 'Méditations métaphysiques',
                'author' => 'René Descartes',
                'isbn' => '9782080706270',
                'category_id' => $categoryIds['Philosophie'],
                'quantity' => 2,
                'available_quantity' => 2,
                'description' => 'Les fondements de la philosophie moderne par Descartes.'
            ],
            [
                'title' => 'Clean Code',
                'author' => 'Robert C. Martin',
                'isbn' => '9780132350884',
                'category_id' => $categoryIds['Informatique'],
                'quantity' => 6,
                'available_quantity' => 6,
                'description' => 'Guide pour écrire du code propre et maintenable.'
            ],
            [
                'title' => 'Orgueil et Préjugés',
                'author' => 'Jane Austen',
                'isbn' => '9782253004226',
                'category_id' => $categoryIds['Romance'],
                'quantity' => 4,
                'available_quantity' => 4,
                'description' => 'Un classique de la littérature romantique anglaise.'
            ],
            [
                'title' => 'Da Vinci Code',
                'author' => 'Dan Brown',
                'isbn' => '9782253121251',
                'category_id' => $categoryIds['Thriller'],
                'quantity' => 5,
                'available_quantity' => 5,
                'description' => 'Un thriller captivant mêlant art, histoire et mystère.'
            ],
            [
                'title' => 'Steve Jobs',
                'author' => 'Walter Isaacson',
                'isbn' => '9782709638326',
                'category_id' => $categoryIds['Biographie'],
                'quantity' => 3,
                'available_quantity' => 3,
                'description' => 'La biographie officielle du fondateur d\'Apple.'
            ],
            [
                'title' => 'Harry Potter à l\'école des sorciers',
                'author' => 'J.K. Rowling',
                'isbn' => '9782070541270',
                'category_id' => $categoryIds['Jeunesse'],
                'quantity' => 8,
                'available_quantity' => 8,
                'description' => 'Le premier tome de la saga du jeune sorcier.'
            ],
            [
                'title' => 'Sapiens',
                'author' => 'Yuval Noah Harari',
                'isbn' => '9782226257017',
                'category_id' => $categoryIds['Essais'],
                'quantity' => 4,
                'available_quantity' => 4,
                'description' => 'Une brève histoire de l\'humanité.'
            ],
            [
                'title' => '1984',
                'author' => 'George Orwell',
                'isbn' => '9782070368228',
                'category_id' => $categoryIds['Fiction'],
                'quantity' => 6,
                'available_quantity' => 6,
                'description' => 'Un roman dystopique sur la surveillance et le totalitarisme.'
            ],
            [
                'title' => 'Fondation',
                'author' => 'Isaac Asimov',
                'isbn' => '9782070360260',
                'category_id' => $categoryIds['Science-Fiction'],
                'quantity' => 3,
                'available_quantity' => 3,
                'description' => 'Le premier tome du cycle de Fondation.'
            ],
            [
                'title' => 'Les Misérables',
                'author' => 'Victor Hugo',
                'isbn' => '9782253096337',
                'category_id' => $categoryIds['Fiction'],
                'quantity' => 4,
                'available_quantity' => 4,
                'description' => 'Le chef-d\'œuvre de Victor Hugo sur la France du XIXe siècle.'
            ],
            [
                'title' => 'Algorithmes',
                'author' => 'Thomas H. Cormen',
                'isbn' => '9782100545261',
                'category_id' => $categoryIds['Informatique'],
                'quantity' => 2,
                'available_quantity' => 2,
                'description' => 'Introduction aux algorithmes et structures de données.'
            ],
            [
                'title' => 'Gone Girl',
                'author' => 'Gillian Flynn',
                'isbn' => '9782253183457',
                'category_id' => $categoryIds['Thriller'],
                'quantity' => 3,
                'available_quantity' => 3,
                'description' => 'Un thriller psychologique sur un couple en crise.'
            ]
        ];

        foreach ($books as $book) {
            DB::table('books')->updateOrInsert(
                ['isbn' => $book['isbn']],
                $book + ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}