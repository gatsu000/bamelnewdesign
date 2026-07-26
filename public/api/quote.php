<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const RECIPIENT_EMAIL = 'info@bamelenerji.com';

function reply(int $status, string $message, ?string $requestId = null): void {
    http_response_code($status);
    $payload = ['message' => $message];
    if ($requestId !== null) $payload['requestId'] = $requestId;
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function single_line($value, int $max = 160): string {
    $text = preg_replace('/[\r\n]+/', ' ', (string)$value);
    return substr(trim($text ?? ''), 0, $max);
}

function consume_rate_limit(string $ipHash): ?bool {
    $rateFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'bamel-quote-' . $ipHash;
    $handle = fopen($rateFile, 'c+');
    if ($handle === false) return null;
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return null;
    }

    try {
        rewind($handle);
        $stored = json_decode((string)stream_get_contents($handle), true);
        $now = time();
        $recent = is_array($stored) ? array_values(array_filter($stored, fn($time) => $now - (int)$time < 900)) : [];
        if (count($recent) >= 5) return false;
        $recent[] = $now;
        $encoded = json_encode($recent);
        if ($encoded === false || !ftruncate($handle, 0) || !rewind($handle) || fwrite($handle, $encoded) !== strlen($encoded) || !fflush($handle)) return null;
        return true;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, 'Sadece POST isteği kabul edilir.');
}

$contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
if (strpos($contentType, 'application/json') !== 0) reply(415, 'JSON içerik türü bekleniyor.');

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 65536) reply(413, 'İstek gövdesi çok büyük.');
$body = json_decode($raw, true);
if (!is_array($body)) reply(400, 'Geçersiz istek gövdesi.');

$requestId = 'BML-' . gmdate('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$name = single_line($body['name'] ?? '', 80);
$company = single_line($body['company'] ?? '', 120);
$email = strtolower(single_line($body['email'] ?? '', 160));
$phone = single_line($body['phone'] ?? '', 30);
$product = single_line($body['product'] ?? '', 120);
$quantity = single_line($body['quantity'] ?? '', 60);
$timeline = single_line($body['timeline'] ?? '', 60);
$sample = single_line($body['sample'] ?? '', 40);
$details = substr(trim((string)($body['details'] ?? '')), 0, 2000);
$services = is_array($body['services'] ?? null) ? array_slice(array_unique(array_filter(array_map(fn($item) => single_line($item, 80), $body['services']))), 0, 8) : [];
$privacy = ($body['privacy'] ?? false) === true;
$website = single_line($body['website'] ?? '', 120);
$startedAt = (int)($body['startedAt'] ?? 0);

// Silently accept automated submissions without delivering mail.
if ($website !== '' || ($startedAt > 0 && (int)(microtime(true) * 1000) - $startedAt < 1500)) {
    reply(202, 'Talebiniz alındı. Ekibimiz kapsamı değerlendirecektir.', $requestId);
}

$rateAllowed = consume_rate_limit(hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown')));
if ($rateAllowed === false) reply(429, 'Kısa sürede çok fazla talep gönderildi. Lütfen 15 dakika sonra tekrar deneyin.');

if ($name === '' || $company === '' || $phone === '' || $email === '' || !$services ||
    $product === '' || $quantity === '' || $timeline === '' || $sample === '' ||
    strlen($details) < 20 || !$privacy
) reply(400, 'Lütfen zorunlu teklif alanlarını doldurun.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(400, 'Geçerli bir e-posta adresi girin.');
if (!preg_match('/^[+\d\s().-]{10,30}$/', $phone)) reply(400, 'Geçerli bir telefon numarası girin.');

if ($rateAllowed === null || !function_exists('mail')) reply(503, 'Teklif servisi yapılandırılıyor. Lütfen info@bamelenerji.com adresinden bize ulaşın.');

$message = implode("\r\n", [
    'Yeni üretim brifi — ' . $requestId,
    '',
    'Ad Soyad       : ' . $name,
    'Firma          : ' . $company,
    'E-posta        : ' . $email,
    'Telefon        : ' . $phone,
    '',
    'Hizmetler      : ' . implode(', ', $services),
    'Ürün / kumaş   : ' . $product,
    'Tahmini adet   : ' . $quantity,
    'Hedef zaman    : ' . $timeline,
    'Numune ihtiyacı: ' . $sample,
    '',
    'Proje notu:',
    $details
]);
$subject = '=?UTF-8?B?' . base64_encode('[' . $requestId . '] Üretim brifi — ' . $company) . '?=';
$headers = implode("\r\n", [
    'From: Bamel Enerji Web <no-reply@bamelenerji.com>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
]);

if (!mail(RECIPIENT_EMAIL, $subject, $message, $headers)) {
    reply(502, 'Talep şu anda iletilemedi. Lütfen tekrar deneyin veya info@bamelenerji.com adresinden bize ulaşın.');
}

$confirmationMessage = implode("\r\n", [
    'Merhaba ' . $name . ',',
    '',
    'Üretim brifiniz Bamel Enerji ekibine ulaştı. Kapsam incelendikten sonra paylaştığınız iletişim bilgileri üzerinden sizinle bağlantı kurulacaktır.',
    '',
    'Talep referansı: ' . $requestId,
    '',
    'Bamel Enerji',
    RECIPIENT_EMAIL
]);
$confirmationSubject = '=?UTF-8?B?' . base64_encode('Üretim talebinizi aldık — ' . $requestId) . '?=';
$confirmationHeaders = implode("\r\n", [
    'From: Bamel Enerji Web <no-reply@bamelenerji.com>',
    'Reply-To: ' . RECIPIENT_EMAIL,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
]);
if (!mail($email, $confirmationSubject, $confirmationMessage, $confirmationHeaders)) {
    error_log('[quote:confirmation-failed] ' . $requestId);
    reply(202, 'Üretim brifiniz ekibimize ulaştı; ancak onay e-postası şu anda gönderilemedi.', $requestId);
}

reply(202, 'Üretim brifiniz ekibimize ulaştı. Referans numaranızı e-posta adresinize de gönderdik.', $requestId);
