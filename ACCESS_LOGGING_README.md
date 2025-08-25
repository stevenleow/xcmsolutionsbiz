# Website Access Logging System

This system logs all website access attempts to your MySQL database. It's designed to work alongside your existing form submission system.

## Setup Instructions

1. **Database Table**
   - The system will automatically create an `access_logs` table if it doesn't exist.
   - The table includes fields for IP address, user agent, request URI, referrer, request method, and timestamp.

2. **Integration**
   - Include the access logging in your existing PHP files (e.g., `index.php`) by adding this at the top, after your database connection is established:
     ```php
     require_once __DIR__ . '/init_access_logging.php';
     ```
   - Make sure you have a PDO database connection available as `$pdo` before including the init file.

3. **Viewing Logs**
   - You can query the `access_logs` table directly in your database.
   - Use the `getAccessStats()` method to get visit statistics:
     ```php
     $accessLogger = new AccessLogger($pdo);
     $stats = $accessLogger->getAccessStats(30); // Last 30 days
     ```

## Database Structure

```sql
CREATE TABLE `access_logs` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Notes

- The system automatically handles IP address detection, including support for proxies via X-Forwarded-For headers.
- Logs include both successful and failed access attempts.
- The table includes indexes for common query patterns (IP address and timestamp).
- Error messages are logged to the PHP error log for troubleshooting.
