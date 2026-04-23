<?php

require '../../../../core/header.php';
require '../../../../core/functions.php';
require '../../../../models/developers/settings/department/Department.php';

$conn = null;
$conn = checkDbConnection();
$val = new Department($conn);

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    if (array_key_exists("id", $_GET)) {
        $val->department_aid = $_GET['id'];

        checkId($val->department_aid);

        $query = checkDelete($val);
        http_response_code(200);
        returnSuccess($val, "Department Delete", $query);
    }

    checkEndpoint();
}

checkAccess();
