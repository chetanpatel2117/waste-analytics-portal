<?php
// Simple configuration for local SQLite usage
return [
    'db_path' => __DIR__ . '/../data/wastemon.sqlite',
    'db_dsn' => 'sqlite:' . __DIR__ . '/../data/wastemon.sqlite',
    'db_options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ],
];
