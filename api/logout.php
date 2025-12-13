<?php
header('Content-Type: application/json');
// For client-only auth (local demo), logout is handled client-side by clearing storage.
// This endpoint exists for symmetry and future server session support.

// If you later implement PHP sessions, call session_start() and destroy session here.

echo json_encode(['success' => true, 'message' => 'Logged out']);
