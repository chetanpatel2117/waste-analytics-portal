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
$password = isset($input['password']) ? $input['password'] : '';

if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing username or password']);
    exit;
}

try {
    $db = get_db();
    // Allow login by username OR email
    $stmt = $db->prepare('SELECT id, username, fullname, email, password_hash FROM users WHERE username = :u OR email = :u LIMIT 1');
    $stmt->execute([':u' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $stored = $user['password_hash'];
        $authenticated = false;
        if (!$stored) {
            $authenticated = false;
        } elseif (strpos($stored, '$') === 0) {
            $authenticated = password_verify($password, $stored);
        } elseif (preg_match('/^[a-f0-9]{32}$/i', $stored)) {
            $authenticated = (md5($password) === $stored);
        } else {
            $authenticated = ($password === $stored);
        }

        if ($authenticated) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'fullname' => $user['fullname'],
                    'email' => $user['email']
                ]
            ]);
            exit;
        }
    }

    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
}
