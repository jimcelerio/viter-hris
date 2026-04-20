<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make use of classes for save database
$val = new Users($conn);

if (array_key_exists("id", $_GET)) {
    $val->users_aid = $_GET['id'];
    $val->users_first_name = $data['users_first_name'];
    $val->users_last_name = $data['users_last_name'];
    $val->users_email = $data['users_email'];
    $val->users_password = $data['users_password'];
    $val->users_role_id = $data['users_role_id'];
    $val->users_updated = date('Y-m-d H:i:s');

    $users_first_name_old = $data['users_first_name_old'];

    // VALIDATIONS
    checkId($val->users_aid);
    compareName(
        $val, // models
        $users_first_name_old, // old record
        $val->users_first_name
    ); // new record

    $query = checkUpdate($val);
    http_response_code(200);
    returnSuccess($val, "Roles Update", $query);
}

checkEndpoint();
