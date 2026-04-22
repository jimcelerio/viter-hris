<?php

require '../../../core/header.php';
require '../../../core/functions.php';
require '../../../models/developers/memo/Memo.php';

$conn = null;
$conn = checkDbConnection();
$val = new Memo($conn);

$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (array_key_exists('start', $_GET)) {
    checkPayload($data);
    $val->start = $_GET['start'];
    $val->total = 10;
    $val->memo_is_active = $data['filterData'];
    $val->search = $data['searchValue'];

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

checkEndpoint();
