<?php

require '../../../../core/header.php';
require '../../../../core/functions.php';
require '../../../../models/developers/settings/direct-report/DirectReport.php';

$conn = null;
$conn = checkDbConnection();
$val = new DirectReport($conn);

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    if (array_key_exists("id", $_GET)) {
        $val->direct_report_aid = $_GET['id'];
        checkId($val->direct_report_aid);

        $recordQuery = $val->readById();
        if (!$recordQuery || $recordQuery->rowCount() == 0) {
            returnHandleError("Invalid request, direct report record does not exist.");
        }
        $record = $recordQuery->fetch(PDO::FETCH_ASSOC);

        $conn->beginTransaction();
        try {
            $clearQuery = $val->clearEmployeeSupervisorDetails($record['direct_report_subordinate']);
            checkQuery($clearQuery, "There's a problem processing your request. (employee supervisor clear)");

            $query = checkDelete($val);

            $conn->commit();
        } catch (Throwable $th) {
            $conn->rollBack();
            returnHandleError("There's a problem processing your request.");
        }

        http_response_code(200);
        returnSuccess($val, "Direct Report Delete", $query);
    }

    checkEndpoint();
}

checkAccess();
