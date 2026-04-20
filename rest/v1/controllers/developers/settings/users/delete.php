<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make use of classes for save database
$val = new Users($conn);

if (array_key_exists("id", $_GET)) {
    $val->users_aid = $_GET['id'];

    // VALIDATION
    checkId($val->users_aid);

    $query = checkDelete($val);
    http_response_code(200);
    returnSuccess($val, "Roles Delete", $query);
}

checkEndpoint();
