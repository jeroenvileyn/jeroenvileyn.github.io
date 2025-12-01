<?php
header("Content-Type: application/json");

// ✅ Prevent IDOR-style tampering (no ?id=, no ?coins=)
if (isset($_GET['id']) || isset($_GET['coins'])) {
    http_response_code(403);
    echo json_encode(["error" => "Invalid parameters"]);
    exit;
}

// ✅ Only allow GET
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Only GET allowed"]);
    exit;
}

// Read path
$path = trim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), "/");
$parts = explode("/", $path);
$last = end($parts);

// 👉 /coins  (overview)
if ($last === "coins") {
    $query = $_SERVER['QUERY_STRING'];
    $url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&" . $query;
    $res = @file_get_contents($url);

    if ($res === false) {
        http_response_code(502);
        echo json_encode(["error" => "Upstream API failed"]);
        exit;
    }

    echo $res;
    exit;
}

// 👉 /coins/{coinName}  (details)
if ($parts[count($parts) - 2] === "coins" && $last !== "coins") {
    $coinName = $last;
    $url = "https://api.coingecko.com/api/v3/coins/" . urlencode($coinName);
    $res = @file_get_contents($url);

    if ($res === false) {
        http_response_code(502);
        echo json_encode(["error" => "Upstream API failed"]);
        exit;
    }

    echo $res;
    exit;
}

// No match
http_response_code(404);
echo json_encode(["error" => "Not found"]);
