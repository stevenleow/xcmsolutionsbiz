<?php
/**
 * Website Access Logger
 * Logs all website access attempts to the database
 */

class AccessLogger {
    private $pdo;
    private $tableName = 'access_logs';
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->createTableIfNotExists();
    }
    
    private function createTableIfNotExists() {
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->tableName}` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `ip_address` varchar(45) NOT NULL,
            `user_agent` varchar(255) DEFAULT NULL,
            `request_uri` varchar(512) NOT NULL,
            `http_referer` varchar(512) DEFAULT NULL,
            `request_method` varchar(10) NOT NULL,
            `status_code` int(3) DEFAULT NULL,
            `response_size` int(11) DEFAULT NULL,
            `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            KEY `idx_ip` (`ip_address`),
            KEY `idx_created_at` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        
        try {
            $this->pdo->exec($sql);
        } catch (PDOException $e) {
            error_log("Error creating access_logs table: " . $e->getMessage());
        }
    }
    
    public function logAccess() {
        $ip = $this->getClientIP();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        $requestUri = $_SERVER['REQUEST_URI'];
        $referer = $_SERVER['HTTP_REFERER'] ?? null;
        $method = $_SERVER['REQUEST_METHOD'];
        
        $sql = "INSERT INTO `{$this->tableName}` 
                (ip_address, user_agent, request_uri, http_referer, request_method) 
                VALUES (:ip, :user_agent, :uri, :referer, :method)";
                
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([
                ':ip' => $ip,
                ':user_agent' => $userAgent,
                ':uri' => $requestUri,
                ':referer' => $referer,
                ':method' => $method
            ]);
            return true;
        } catch (PDOException $e) {
            error_log("Error logging access: " . $e->getMessage());
            return false;
        }
    }
    
    private function getClientIP() {
        $ip = '';
        
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        }
        
        // Handle multiple IPs in X-Forwarded-For
        if (strpos($ip, ',') !== false) {
            $ips = explode(',', $ip);
            $ip = trim($ips[0]);
        }
        
        return $ip;
    }
    
    public function getAccessStats($days = 30) {
        $sql = "SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as total_visits,
                    COUNT(DISTINCT ip_address) as unique_visitors
                FROM `{$this->tableName}`
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                GROUP BY DATE(created_at)
                ORDER BY date DESC";
                
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$days]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting access stats: " . $e->getMessage());
            return [];
        }
    }
}
