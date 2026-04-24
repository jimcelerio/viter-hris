<?php

$conn = null;
$conn = checkDbConnection();
$val = new Notification($conn);

if (empty($_GET)) {
    $query = checkReadAll($val);
    http_response_code(200);
    getQueriedData($query);
}

checkEndpoint();
