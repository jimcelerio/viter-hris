<?php

$conn = null;
$conn = checkDbConnection();
$val = new Department($conn);

$val->department_is_active = 1;
$val->department_name = trim($data['department_name']);
$val->department_created = date('Y-m-d H:i:s');
$val->department_updated = date('Y-m-d H:i:s');

// validation
checkPayload($data);
checkIndex($data, 'department_name');
isNameExist($val, 'Department name');

$query = checkCreate($val);
http_response_code(200);
returnSuccess($val, "Department Create", $query);
