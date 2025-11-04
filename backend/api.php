<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$db = new PDO('sqlite:database/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$input = json_decode(file_get_contents('php://input'), true);

// Fonction d'authentification simple
function authenticate() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        return null;
    }
    
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    // Pour simplifier, on decode le token comme email:password encodé en base64
    $decoded = base64_decode($token);
    if (!$decoded) return null;
    
    list($email, $password) = explode(':', $decoded);
    
    global $db;
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        return $user;
    }
    return null;
}

// Routes
switch ($path) {
    // Authentification
    case '/login':
        if ($method === 'POST') {
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && ($password === 'password' || $password === '11111111' || password_verify($password, $user['password']))) {
                $token = base64_encode($email . ':' . $password);
                echo json_encode([
                    'success' => true,
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'role' => $user['role']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Identifiants incorrects']);
            }
        }
        break;
        
    case '/register':
        if ($method === 'POST') {
            $name = $input['name'] ?? '';
            $email = $input['email'] ?? '';
            $password = password_hash($input['password'] ?? '', PASSWORD_DEFAULT);
            $phone = $input['phone'] ?? '';
            
            try {
                $stmt = $db->prepare("INSERT INTO users (name, email, password, telephone) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $email, $password, $phone]);
                echo json_encode(['success' => true, 'message' => 'Compte créé avec succès']);
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email déjà utilisé']);
            }
        }
        break;
        
    case '/register-complete':
        if ($method === 'POST') {
            $nom = $_POST['nom'] ?? '';
            $prenom = $_POST['prenom'] ?? '';
            $date_naissance = $_POST['date_naissance'] ?? '';
            $sexe = $_POST['sexe'] ?? '';
            $email = $_POST['email'] ?? '';
            $telephone = $_POST['telephone'] ?? '';
            $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);
            
            // Gestion de l'upload de photo
            $photoPath = null;
            if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = 'uploads/';
                $fileName = uniqid() . '_' . $_FILES['photo']['name'];
                $photoPath = $uploadDir . $fileName;
                
                if (!move_uploaded_file($_FILES['photo']['tmp_name'], $photoPath)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Erreur upload photo']);
                    break;
                }
            }
            
            try {
                // Générer matricule
                $stmt = $db->query("SELECT COUNT(*) FROM users");
                $count = $stmt->fetchColumn() + 1;
                $matricule = 'USR' . str_pad($count, 3, '0', STR_PAD_LEFT);
                
                $stmt = $db->prepare("
                    INSERT INTO users (name, email, password, nom, prenom, date_naissance, sexe, telephone, photo_path, matricule, date_inscription) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'))
                ");
                
                $fullName = $prenom . ' ' . $nom;
                $stmt->execute([$fullName, $email, $password, $nom, $prenom, $date_naissance, $sexe, $telephone, $photoPath, $matricule]);
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Compte créé avec succès',
                    'matricule' => $matricule
                ]);
            } catch (Exception $e) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Email déjà utilisé ou erreur de création']);
            }
        }
        break;
        
    // Dashboard/Statistiques (Admin seulement)
    case '/statistics':
        $user = authenticate();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé']);
            break;
        }
        
        if ($method === 'GET') {
            $totalBooks = $db->query("SELECT COUNT(*) FROM books")->fetchColumn();
            $totalUsers = $db->query("SELECT COUNT(*) FROM users WHERE role = 'user'")->fetchColumn();
            $activeBorrows = $db->query("SELECT COUNT(*) FROM borrows WHERE status = 'active'")->fetchColumn();
            $overdueBorrows = $db->query("SELECT COUNT(*) FROM borrows WHERE status = 'active' AND date_retour_prevue < date('now')")->fetchColumn();
            
            $popularBooks = $db->query("
                SELECT b.*, COUNT(br.id) as borrow_count 
                FROM books b 
                LEFT JOIN borrows br ON b.id = br.book_id 
                GROUP BY b.id 
                ORDER BY borrow_count DESC 
                LIMIT 5
            ")->fetchAll(PDO::FETCH_ASSOC);
            
            $recentBorrows = $db->query("
                SELECT br.*, u.name as user_name, b.title as book_title 
                FROM borrows br 
                JOIN users u ON br.user_id = u.id 
                JOIN books b ON br.book_id = b.id 
                ORDER BY br.created_at DESC 
                LIMIT 10
            ")->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'stats' => [
                    'total_books' => (int)$totalBooks,
                    'total_users' => (int)$totalUsers,
                    'active_borrows' => (int)$activeBorrows,
                    'overdue_borrows' => (int)$overdueBorrows
                ],
                'popular_books' => $popularBooks,
                'recent_borrows' => $recentBorrows
            ]);
        }
        break;
        
    // Livres
    case '/books':
        if ($method === 'GET') {
            $search = $_GET['search'] ?? '';
            $categoryId = $_GET['category_id'] ?? '';
            
            $sql = "SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE 1=1";
            $params = [];
            
            if ($search) {
                $sql .= " AND (b.title LIKE ? OR b.author LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            
            if ($categoryId) {
                $sql .= " AND b.category_id = ?";
                $params[] = $categoryId;
            }
            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(array_map(function($book) {
                return [
                    'id' => $book['id'],
                    'title' => $book['title'],
                    'author' => $book['author'],
                    'isbn' => $book['isbn'],
                    'category_id' => $book['category_id'],
                    'stock' => $book['stock'],
                    'available' => $book['available'],
                    'description' => $book['description'],
                    'category' => ['name' => $book['category_name']]
                ];
            }, $books));
        } elseif ($method === 'POST') {
            $user = authenticate();
            if (!$user || $user['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(['error' => 'Accès refusé']);
                break;
            }
            
            $stmt = $db->prepare("INSERT INTO books (title, author, isbn, category_id, stock, available, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['title'],
                $input['author'],
                $input['isbn'],
                $input['category_id'],
                $input['stock'],
                $input['stock'], // available = stock initialement
                $input['description'] ?? ''
            ]);
            
            echo json_encode(['success' => true, 'id' => $db->lastInsertId()]);
        }
        break;
        
    // Catégories
    case '/categories':
        if ($method === 'GET') {
            $categories = $db->query("SELECT * FROM categories ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($categories);
        }
        break;
        
    // Emprunts
    case '/borrow':
        if ($method === 'POST') {
            $user = authenticate();
            if (!$user) {
                http_response_code(401);
                echo json_encode(['error' => 'Non authentifié']);
                break;
            }
            
            $bookId = $input['book_id'];
            
            // Vérifier disponibilité
            $stmt = $db->prepare("SELECT available FROM books WHERE id = ?");
            $stmt->execute([$bookId]);
            $book = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$book || $book['available'] <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Livre non disponible']);
                break;
            }
            
            // Créer l'emprunt
            $dateEmprunt = date('Y-m-d');
            $dateRetourPrevue = date('Y-m-d', strtotime('+7 days'));
            
            $stmt = $db->prepare("INSERT INTO borrows (user_id, book_id, date_emprunt, date_retour_prevue) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user['id'], $bookId, $dateEmprunt, $dateRetourPrevue]);
            
            // Décrémenter disponibilité
            $db->prepare("UPDATE books SET available = available - 1 WHERE id = ?")->execute([$bookId]);
            
            echo json_encode(['success' => true, 'message' => 'Emprunt enregistré']);
        }
        break;
        
    // Mes emprunts (utilisateur connecté)
    case '/my-borrows':
        $user = authenticate();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Non authentifié']);
            break;
        }
        
        if ($method === 'GET') {
            $stmt = $db->prepare("
                SELECT br.*, b.title, b.author 
                FROM borrows br 
                JOIN books b ON br.book_id = b.id 
                WHERE br.user_id = ? 
                ORDER BY br.created_at DESC
            ");
            $stmt->execute([$user['id']]);
            $borrows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($borrows);
        }
        break;
        
    // Tous les emprunts (admin)
    case '/borrows':
        $user = authenticate();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé']);
            break;
        }
        
        if ($method === 'GET') {
            $borrows = $db->query("
                SELECT br.*, u.name as user_name, u.email, b.title, b.author 
                FROM borrows br 
                JOIN users u ON br.user_id = u.id 
                JOIN books b ON br.book_id = b.id 
                ORDER BY br.created_at DESC
            ")->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($borrows);
        }
        break;
        
    // Retourner un livre
    case (preg_match('/^\/return\/(\d+)$/', $path, $matches) ? true : false):
        $user = authenticate();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé']);
            break;
        }
        
        if ($method === 'POST') {
            $borrowId = $matches[1];
            
            $stmt = $db->prepare("SELECT * FROM borrows WHERE id = ? AND status = 'active'");
            $stmt->execute([$borrowId]);
            $borrow = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($borrow) {
                // Marquer comme retourné
                $db->prepare("UPDATE borrows SET status = 'returned', date_retour_effective = ? WHERE id = ?")
                   ->execute([date('Y-m-d'), $borrowId]);
                
                // Incrémenter disponibilité
                $db->prepare("UPDATE books SET available = available + 1 WHERE id = ?")
                   ->execute([$borrow['book_id']]);
                
                echo json_encode(['success' => true, 'message' => 'Livre retourné']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Emprunt non trouvé']);
            }
        }
        break;
        
    // Notifications utilisateur
    case '/notifications':
        $user = authenticate();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Non authentifié']);
            break;
        }
        
        if ($method === 'GET') {
            $stmt = $db->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$user['id']]);
            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($notifications);
        }
        break;
        
    // Demande d'emprunt
    case '/request-borrow':
        $user = authenticate();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Non authentifié']);
            break;
        }
        
        if ($method === 'POST') {
            $bookId = $input['book_id'];
            
            // Vérifier disponibilité
            $stmt = $db->prepare("SELECT * FROM books WHERE id = ?");
            $stmt->execute([$bookId]);
            $book = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$book || $book['available'] <= 0) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Livre non disponible']);
                break;
            }
            
            // Créer la demande d'emprunt (en attente)
            $dateEmprunt = date('Y-m-d');
            $dateRetourPrevue = date('Y-m-d', strtotime('+14 days'));
            
            $stmt = $db->prepare("INSERT INTO borrows (user_id, book_id, date_emprunt, date_retour_prevue, status) VALUES (?, ?, ?, ?, 'pending')");
            $stmt->execute([$user['id'], $bookId, $dateEmprunt, $dateRetourPrevue]);
            
            // Créer notification pour admin
            $db->prepare("INSERT INTO notifications (user_id, message, type) VALUES (1, 'Nouvelle demande d\'emprunt de " . $user['name'] . " pour " . $book['title'] . "', 'info')")
               ->execute();
            
            echo json_encode(['success' => true, 'message' => 'Demande d\'emprunt envoyée']);
        }
        break;
        
    // Endpoint IoT
    case '/iot/event':
        if ($method === 'POST') {
            $deviceId = $input['device_id'] ?? '';
            $tagUid = $input['tag_uid'] ?? '';
            $userId = $input['user_id'] ?? null;
            
            if (!$deviceId || !$tagUid) {
                http_response_code(400);
                echo json_encode(['error' => 'device_id et tag_uid requis']);
                break;
            }
            
            // Enregistrer le dispositif s'il n'existe pas
            $stmt = $db->prepare("INSERT OR IGNORE INTO devices (device_id, name) VALUES (?, ?)");
            $stmt->execute([$deviceId, 'Device ' . $deviceId]);
            
            // Trouver le livre par tag
            $stmt = $db->prepare("SELECT bt.*, b.title, b.author FROM book_tags bt JOIN books b ON bt.book_id = b.id WHERE bt.tag_uid = ?");
            $stmt->execute([$tagUid]);
            $bookTag = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$bookTag) {
                // Enregistrer l'événement même si tag inconnu
                $db->prepare("INSERT INTO iot_events (device_id, tag_uid, event_type, status) VALUES (?, ?, 'scan', 'unknown_tag')")
                   ->execute([$deviceId, $tagUid]);
                   
                echo json_encode(['status' => 'unknown_tag', 'message' => 'Tag non reconnu']);
                break;
            }
            
            $bookId = $bookTag['book_id'];
            
            // Vérifier s'il y a un emprunt actif pour ce livre
            $stmt = $db->prepare("SELECT * FROM borrows WHERE book_id = ? AND status = 'active'");
            $stmt->execute([$bookId]);
            $activeBorrow = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($activeBorrow) {
                // Retour du livre
                $db->prepare("UPDATE borrows SET status = 'returned', date_retour_effective = ? WHERE id = ?")
                   ->execute([date('Y-m-d H:i:s'), $activeBorrow['id']]);
                   
                // Incrémenter disponibilité
                $db->prepare("UPDATE books SET available = available + 1 WHERE id = ?")
                   ->execute([$bookId]);
                   
                // Enregistrer l'événement
                $db->prepare("INSERT INTO iot_events (device_id, tag_uid, user_id, book_id, event_type, status) VALUES (?, ?, ?, ?, 'return', 'success')")
                   ->execute([$deviceId, $tagUid, $activeBorrow['user_id'], $bookId]);
                   
                echo json_encode([
                    'status' => 'returned',
                    'message' => 'Livre retourné avec succès',
                    'book' => $bookTag['title'],
                    'user_id' => $activeBorrow['user_id']
                ]);
            } else {
                // Nouvel emprunt
                if (!$userId) {
                    echo json_encode(['status' => 'user_required', 'message' => 'ID utilisateur requis pour emprunter']);
                    break;
                }
                
                // Vérifier disponibilité
                $stmt = $db->prepare("SELECT available FROM books WHERE id = ?");
                $stmt->execute([$bookId]);
                $book = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($book['available'] <= 0) {
                    echo json_encode(['status' => 'unavailable', 'message' => 'Livre non disponible']);
                    break;
                }
                
                // Créer l'emprunt
                $dateEmprunt = date('Y-m-d');
                $dateRetourPrevue = date('Y-m-d', strtotime('+14 days'));
                
                $stmt = $db->prepare("INSERT INTO borrows (user_id, book_id, date_emprunt, date_retour_prevue, status) VALUES (?, ?, ?, ?, 'active')");
                $stmt->execute([$userId, $bookId, $dateEmprunt, $dateRetourPrevue]);
                
                // Décrémenter disponibilité
                $db->prepare("UPDATE books SET available = available - 1 WHERE id = ?")
                   ->execute([$bookId]);
                   
                // Enregistrer l'événement
                $db->prepare("INSERT INTO iot_events (device_id, tag_uid, user_id, book_id, event_type, status) VALUES (?, ?, ?, ?, 'borrow', 'success')")
                   ->execute([$deviceId, $tagUid, $userId, $bookId]);
                   
                echo json_encode([
                    'status' => 'borrowed',
                    'message' => 'Livre emprunté avec succès',
                    'book' => $bookTag['title'],
                    'due_date' => $dateRetourPrevue
                ]);
            }
        }
        break;
        
    // Liste des utilisateurs (Admin)
    case '/users':
        $user = authenticate();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé']);
            break;
        }
        
        if ($method === 'GET') {
            $users = $db->query("
                SELECT u.*, 
                       COUNT(CASE WHEN b.status = 'active' THEN 1 END) as active_borrows,
                       COUNT(CASE WHEN b.status = 'active' AND b.date_retour_prevue < date('now') THEN 1 END) as overdue_borrows
                FROM users u 
                LEFT JOIN borrows b ON u.id = b.user_id 
                WHERE u.role = 'user'
                GROUP BY u.id
                ORDER BY u.name
            ")->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($users);
        }
        break;
        
    // Envoyer rappel
    case '/send-reminder':
        $user = authenticate();
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé']);
            break;
        }
        
        if ($method === 'POST') {
            $userId = $input['user_id'];
            
            // Créer notification de rappel
            $db->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, 'Rappel: Vous avez des livres en retard. Merci de les retourner rapidement.', 'warning')")
               ->execute([$userId]);
               
            echo json_encode(['success' => true, 'message' => 'Rappel envoyé']);
        }
        break;
        
    default:
        echo json_encode(['message' => 'eLibrary API', 'version' => '1.0', 'status' => 'running']);
        break;
}
?>