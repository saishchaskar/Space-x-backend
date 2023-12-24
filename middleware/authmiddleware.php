<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3002/");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Custom-Token");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    http_response_code(200); // Respond with HTTP 200 status for OPTIONS requests
    exit();
}
// Check if the request contains the custom token in the header
$headers = apache_request_headers();
$customToken = isset($headers['Custom-Token']) ? $headers['Custom-Token'] : '';

// Your custom token value
$validToken = '123456s';
echo $validToken;
// Verify if the token matches
if ($customToken !== $validToken) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized"));
    exit();
}

// If the token is valid, pass the request to the SpaceX API
$spaceXURL = 'https://api.spacexdata.com/v3/capsules';
$ch = curl_init($spaceXURL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Forward the response from SpaceX API
http_response_code($httpcode);
echo $response;
