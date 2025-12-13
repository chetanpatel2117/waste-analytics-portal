<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}
    $username = isset($input['username']) ? trim($input['username']) : '';
    $fullname = isset($input['fullname']) ? trim($input['fullname']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? $input['password'] : '';

    // If username not supplied, derive from email local-part
    if ($username === '' && $email !== '') {
        $local = strtolower(explode('@', $email)[0]);
        // sanitize: allow letters, numbers, underscores
        $local = preg_replace('/[^a-z0-9_]/', '_', $local);
        $username = substr($local, 0, 30);
    }

    if ($username === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Username and password required']);
        exit;
    }

try {
    $db = get_db();

    // Ensure unique username; if exists, append numeric suffix
    $base = $username;
    $i = 0;
    while (true) {
        $stmt = $db->prepare('SELECT id FROM users WHERE username = :u LIMIT 1');
        $stmt->execute([':u' => $username]);
        if (!$stmt->fetch()) break;
        $i++;
        $username = $base . $i;
        if ($i > 1000) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Unable to generate unique username']);
            exit;
        }
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO users (username, fullname, email, password_hash, role) VALUES (:u, :f, :e, :p, :r)');
    $stmt->execute([':u' => $username, ':f' => $fullname, ':e' => $email, ':p' => $hash, ':r' => 'user']);

    echo json_encode(['success' => true, 'user' => ['username' => $username, 'fullname' => $fullname, 'email' => $email]]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
}
