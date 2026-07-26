<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

echo json_encode([
    'ok' => true,
    'service' => 'bamel-enerji-api',
    'mailConfigured' => function_exists('mail')
], JSON_UNESCAPED_UNICODE);
