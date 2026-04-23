<?php

require '../../../../core/header.php';
require '../../../../core/functions.php';
require '../../../../models/developers/settings/department/Department.php';

$conn = null;
$conn = checkDbConnection();
$val = new Department($conn);

$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    if (array_key_exists("id", $_GET)) {
        checkPayload($data);

        $val->department_aid = $_GET['id'];
        $val->department_is_active = trim($data['isActive']);
        $val->department_updated = date('Y-m-d H:i:s');

        checkId($val->department_aid);

        $query = checkActive($val);
        http_response_code(200);
        returnSuccess($val, "Department Active", $query);
    }

    checkEndpoint();
}

checkAccess();
