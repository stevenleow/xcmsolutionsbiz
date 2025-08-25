<?php
/**
 * Access Logging Initialization
 * 
 * This file initializes the access logging system and should be included
 * in your PHP files after the database connection is established.
 */

// Only proceed if we have a database connection
if (!isset($pdo) && file_exists('/home/xcmswvfv/config/db_config.php')) {
    try {
        // Include the database configuration
        $dbConfig = include '/home/xcmswvfv/config/db_config.php';
        
        // Create PDO connection if it doesn't exist
        if (!isset($pdo) && isset($dbConfig['servername'], $dbConfig['dbname'], $dbConfig['username'], $dbConfig['password'])) {
            $dsn = "mysql:host={$dbConfig['servername']};dbname={$dbConfig['dbname']};charset=utf8mb4";
            // Create PDO connection with timezone setting
            $pdo = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET time_zone = '+08:00'"
            ]);
            
            // Also set PHP's default timezone
            date_default_timezone_set('Asia/Singapore');
            
            // Initialize and log access
            require_once __DIR__ . '/includes/access_logger.php';
            $accessLogger = new AccessLogger($pdo);
            $accessLogger->logAccess();
        } else {
            error_log("Access Logger: Missing required database configuration");
        }
        
    } catch (PDOException $e) {
        // Log error but don't break the site
        error_log("Access Logger Error: " . $e->getMessage());
    }
} else if (!file_exists('/home/xcmswvfv/config/db_config.php')) {
    error_log("Access Logger: Database configuration file not found");
}
