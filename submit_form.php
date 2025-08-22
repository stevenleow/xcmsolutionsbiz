<?php
// Start session for CSRF token
session_start();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Redirect to homepage if accessed directly
    header('Location: /');
    exit;
}

// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

// Function to send JSON response
function sendResponse($success, $message, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'timestamp' => date('c')
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Log function for debugging
function logMessage($message, $data = null) {
    $log = '[' . date('Y-m-d H:i:s') . '] ' . $message;
    if ($data !== null) {
        $log .= ': ' . print_r($data, true);
    }
    $log .= "\n";
    file_put_contents(__DIR__ . '/form_errors.log', $log, FILE_APPEND);
    error_log($log);
}

// --- Database credentials ---
$servername = "localhost";
$username = "xcmswvfv_formuser";
$password = "vaTtyz-0bascy-kudkut";
$dbname = "xcmswvfv_formdb";

// --- Pushover credentials ---
$pushover_user = "YOUR_USER_KEY";
$pushover_token = "YOUR_APP_TOKEN";

// Process POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) || 
        !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        logMessage('CSRF token validation failed', [
            'session_token' => $_SESSION['csrf_token'] ?? 'not set',
            'posted_token' => $_POST['csrf_token'] ?? 'not set'
        ]);
        sendResponse(false, 'Invalid security token. Please refresh the page and try again.', 403);
    }
    
    // Unset the used token to prevent reuse
    unset($_SESSION['csrf_token']);
    
    try {
        // Log the incoming request
        logMessage('New form submission', [
            'method' => $_SERVER['REQUEST_METHOD'],
            'post_data' => $_POST,
            'raw_input' => file_get_contents('php://input')
        ]);

        // Validate required fields
        $required = ['name', 'email', 'message'];
        $missing = [];
        
        foreach ($required as $field) {
            if (empty(trim($_POST[$field] ?? ''))) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            logMessage('Missing required fields', $missing);
            sendResponse(false, "Please fill in all required fields: " . implode(', ', $missing), 400);
        }

        // Sanitize and validate input
        $name = trim(htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8'));
        $email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
        $message = trim(htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8'));
        $ip = $_SERVER['REMOTE_ADDR'];
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        $now = date('Y-m-d H:i:s');

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            logMessage('Invalid email format', $email);
            sendResponse(false, "Please enter a valid email address.", 400);
        }

        // Connect to database
        $conn = new mysqli($servername, $username, $password, $dbname);
        
        // Check connection
        if ($conn->connect_error) {
            logMessage('Database connection failed', $conn->connect_error);
            sendResponse(false, "Database connection failed. Please try again later.", 500);
        }
        
        // Set charset to ensure proper encoding
        $conn->set_charset('utf8mb4');

        // Prepare and execute the query
        $stmt = $conn->prepare("INSERT INTO submissions (name, email, message, submitted_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)");
        
        if (!$stmt) {
            logMessage('Prepare failed', $conn->error);
            $conn->close();
            sendResponse(false, "An error occurred. Please try again.", 500);
        }
        
        $stmt->bind_param("ssssss", $name, $email, $message, $now, $ip, $ua);
        
        if ($stmt->execute()) {
            logMessage('Submission successful', ['email' => $email]);
            $stmt->close();
            $conn->close();
            sendResponse(true, 'Thank you for reaching out! Your message is on its way to our team. We\'re excited to connect with you and will be in touch shortly. Have a wonderful day!');
        } else {
            logMessage('Execute failed', $stmt->error);
            $stmt->close();
            $conn->close();
            sendResponse(false, 'Submission failed. Please try again.', 500);
        }
        
    } catch (Exception $e) {
        logMessage('Unexpected error', $e->getMessage());
        if (isset($conn) && $conn) {
            $conn->close();
        }
        sendResponse(false, 'An unexpected error occurred. Please try again later.', 500);
    }
} else {
    sendResponse(false, 'Invalid request method.', 405);
}
?>