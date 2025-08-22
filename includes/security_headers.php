<?php
// Security Headers Configuration
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: geolocation=(), microphone=(), camera=()");

// Define the Content Security Policy
$csp = [
    "default-src 'self';",
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cdn.jsdelivr.net;",
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com https://unpkg.com;",
    "img-src 'self' data: https:;",
    "font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com data:;",
    "connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;",
    "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/;",
    "form-action 'self';",
    "base-uri 'self';",
    "object-src 'none';",
    "frame-ancestors 'none';",
    "upgrade-insecure-requests;"
];

// Set the CSP header
header("Content-Security-Policy: " . implode(" ", $csp));
?>
