<?php
/**
 * Bamel Enerji - Teklif Talebi API (Hostinger PHP)
 *
 * Receives POST /api/quote with JSON body, validates, emails the team,
 * and returns the same JSON shape as the dev Express server so the
 * client-side code works unchanged in production.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const RECIPIENT_EMAIL = 'info@bamelenerji.com';
const RECIPIENT_NAME  = 'Bamel Enerji';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['message' => 'Sadece POST isteği kabul edilir.']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['message' => 'Geçersiz istek gövdesi. JSON bekleniyor.']);
    exit;
}

$name     = trim((string)($body['name']     ?? ''));
$company  = trim((string)($body['company']  ?? ''));
$email    = trim((string)($body['email']    ?? ''));
$phone    = trim((string)($body['phone']    ?? ''));
$quantity = trim((string)($body['quantity'] ?? ''));
$details  = trim((string)($body['details']  ?? ''));
$sample   = trim((string)($body['sample']   ?? ''));
$services = $body['services'] ?? [];
$privacy  = !empty($body['privacy']);

if ($name === '' || $company === '' || $email === '' || $phone === '' ||
    !is_array($services) || count($services) === 0 ||
    $quantity === '' || $details === '' || !$privacy
) {
    http_response_code(400);
    echo json_encode(['message' => 'Lütfen zorunlu teklif alanlarını doldurun.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['message' => 'Geçerli bir kurumsal e-posta adresi girin.']);
    exit;
}

// Build email body (plain text, no HTML injection possible).
$servicesList = implode(', ', array_map('strval', $services));
$lines = [
    'Yeni teklif talebi alındı:',
    '',
    'Ad Soyad : ' . $name,
    'Firma    : ' . $company,
    'E-posta  : ' . $email,
    'Telefon  : ' . $phone,
    '',
    'Hizmetler      : ' . $servicesList,
    'Tahmini Adet   : ' . $quantity,
    'Numune ihtiyacı: ' . ($sample !== '' ? $sample : 'Belirtilmedi'),
    '',
    'Açıklama:',
    wordwrap($details, 78),
];

$subject = sprintf('Teklif Talebi: %s', $company);
$message = implode("\r\n", $lines);
$headers = [
    'From: Bamel Enerji Web <no-reply@bamelenerji.com>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
];

// Try to deliver email; persist to log regardless of outcome so nothing is lost.
@mail(RECIPIENT_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $message, implode("\r\n", $headers));

$logEntry = sprintf(
    "[%s] %s | %s | %s | services=%s\n",
    date('c'),
    $name,
    $company,
    $email,
    $servicesList
);
@file_put_contents(__DIR__ . '/quotes.log', $logEntry, FILE_APPEND | LOCK_EX);

http_response_code(202);
echo json_encode(['message' => 'Talebiniz alındı. Ekibimiz kapsamı değerlendirecektir.']);
