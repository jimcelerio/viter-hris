<?php

require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
// use models
require '../../../../models/developers/settings/users/Users.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make use of classes for save database
// store models into variable
$val = new Users($conn);
// get payload from frontend
$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    if (array_key_exists('start', $_GET)) {
        // check data if exist and data is required
        checkPayload($data);
        $val->start = $_GET['start'];
        $val->total = 10;
        $val->users_is_active = $data['filterData'];
        $val->search = $data['searchValue'];
        // $val->users_aid = $_GET['id'];

        // validate is id
        checkLimitId($val->start, $val->total);

        $query = checkReadLimit($val);
        $total_result = checkReadAll($val);
        http_response_code(200);
        checkReadQuery(
            $query,
            $total_result,
            $val->total,
            $val->start
        );
    }

    // return 404 if endpoint is active
    checkEndpoint();
}

// if access is not valid then return access error.
checkAccess();



