<?php
// Simple PDO SQLite helper. On first run, creates schema and seeds sample data.
function get_db() {
    static $db = null;
    if ($db) return $db;

    $cfg = require __DIR__ . '/config.php';
    $dsn = $cfg['db_dsn'];
    $opts = $cfg['db_options'];

    // Ensure data dir exists
    $dataDir = dirname($cfg['db_path']);
    if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);

    $isNew = !file_exists($cfg['db_path']);

    $db = new PDO($dsn);
    foreach ($opts as $k => $v) {
        $db->setAttribute($k, $v);
    }

    if ($isNew) initialize_db($db);
    return $db;
}

function initialize_db(PDO $db) {
    // Create tables (SQLite compatible)
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        fullname TEXT,
        email TEXT,
        password_hash TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    $db->exec("CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_waste REAL DEFAULT 0.0,
        diversion_pct INTEGER DEFAULT 0,
        recycling_pct INTEGER DEFAULT 0,
        savings_usd REAL DEFAULT 0.0,
        avg_fill_pct INTEGER DEFAULT 0,
        overflow_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    $db->exec("CREATE TABLE IF NOT EXISTS composition (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        value INTEGER NOT NULL
    );");

    $db->exec("CREATE TABLE IF NOT EXISTS bins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        fill_level_pct INTEGER DEFAULT 0,
        status TEXT DEFAULT 'ok',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    $db->exec("CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'staff',
        route TEXT,
        status TEXT DEFAULT 'available',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    $db->exec("CREATE TABLE IF NOT EXISTS trucks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        truck_number TEXT NOT NULL,
        route TEXT,
        status TEXT DEFAULT 'idle',
        last_update DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    // Seed data
    $stmt = $db->prepare('INSERT INTO users (username, fullname, email, password_hash, role) VALUES (:u, :f, :e, :p, :r)');
    $pw = password_hash('password', PASSWORD_DEFAULT); // demo password: 'password'
    $stmt->execute([':u' => 'admin', ':f' => 'Admin User', ':e' => 'admin@example.com', ':p' => $pw, ':r' => 'admin']);

    $db->exec("INSERT INTO metrics (total_waste, diversion_pct, recycling_pct, savings_usd, avg_fill_pct, overflow_count) VALUES (25.80, 85, 72, 3450.00, 78, 3);");

    $db->exec("INSERT INTO composition (label, value) VALUES ('Recyclable', 45), ('General', 30), ('Organic', 25);");

    $db->exec("INSERT INTO bins (name, latitude, longitude, fill_level_pct, status) VALUES
        ('Bin 101', 51.505, -0.09, 78, 'ok'),
        ('Bin 102', 51.51, -0.1, 82, 'ok'),
        ('Bin 103', 51.499, -0.08, 95, 'overflow');");

    $db->exec("INSERT INTO staff (name, role, route, status) VALUES
        ('Alex Johnson', 'Collector', 'Route 5 - Downtown', 'on-duty'),
        ('Maria Garcia', 'Collector', 'Route 2 - Suburbs', 'on-duty'),
        ('Sam Chen', 'Support', NULL, 'standby');");

    $db->exec("INSERT INTO trucks (truck_number, route, status) VALUES
        ('Truck #001', 'Route 5', 'complete'),
        ('Truck #002', 'Route 2', 'enroute'),
        ('Truck #003', NULL, 'maintenance');");
}
