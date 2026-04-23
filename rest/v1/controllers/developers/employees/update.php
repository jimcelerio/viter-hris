<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make use of classes for save database
$val = new Employees($conn);

if (array_key_exists("id", $_GET)) {
    $val->employee_aid = $_GET['id'];
    $val->employee_is_active = 1;
    $val->employee_first_name = trim($data['employee_first_name']);
    $val->employee_middle_name = trim($data['employee_middle_name']);
    $val->employee_last_name = trim($data['employee_last_name']);
    $val->employee_email = trim($data['employee_email']);
    $val->employee_department_id = trim($data['employee_department_id']);
    $val->employee_updated = date('Y-m-d H:i:s');

    $employee_first_name_old = $data['employee_first_name_old'];

    // VALIDATIONS
    checkPayload($data);
    checkIndex($data, 'employee_department_id');
    checkId($val->employee_aid);
    compareName(
        $val, // models
        $employee_first_name_old, // old record
        $val->employee_first_name
    ); // new record

    $query = checkUpdate($val);
    http_response_code(200);
    returnSuccess($val, "Employee Update", $query);
}

checkEndpoint();
