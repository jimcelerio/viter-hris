<?php

require '../../../core/header.php';
require '../../../core/functions.php';
require '../../../models/developers/employees/Employees.php';

// check database connection
$conn = null;
$conn = checkDbConnection();
// make use of classes for save database
$val = new Employees($conn);

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    if (array_key_exists("id", $_GET)) {
        $val->employee_aid = $_GET['id'];

        // VALIDATION
        checkId($val->employee_aid);

        $query = checkDelete($val);
        http_response_code(200);
        returnSuccess($val, "Employee Delete", $query);
    }

    checkEndpoint();
}

checkAccess();
