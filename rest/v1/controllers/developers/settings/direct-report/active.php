<?php

require '../../../../core/header.php';
require '../../../../core/functions.php';
require '../../../../models/developers/settings/direct-report/DirectReport.php';

$conn = null;
$conn = checkDbConnection();
$val = new DirectReport($conn);

$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    if (array_key_exists("id", $_GET)) {
        checkPayload($data);

        $val->direct_report_aid = $_GET['id'];
        $val->direct_report_is_active = trim($data['isActive']);
        $val->direct_report_updated = date('Y-m-d H:i:s');

        checkId($val->direct_report_aid);

        $recordQuery = $val->readById();
        if (!$recordQuery || $recordQuery->rowCount() == 0) {
            returnHandleError("Invalid request, direct report record does not exist.");
        }
        $record = $recordQuery->fetch(PDO::FETCH_ASSOC);

        $conn->beginTransaction();
        try {
            $query = checkActive($val);

            if ((int) $val->direct_report_is_active === 0) {
                $clearQuery = $val->clearEmployeeSupervisorDetails($record['direct_report_subordinate']);
                checkQuery($clearQuery, "There's a problem processing your request. (employee supervisor clear)");
            } else {
                $supervisorQuery = $val->readEmployeeById($record['direct_report_supervisor']);
                if (!$supervisorQuery || $supervisorQuery->rowCount() == 0) {
                    returnHandleError("Invalid request, selected supervisor does not exist.");
                }
                $supervisorData = $supervisorQuery->fetch(PDO::FETCH_ASSOC);

                $syncQuery = $val->updateEmployeeSupervisorDetails(
                    $record['direct_report_subordinate'],
                    $record['direct_report_supervisor'],
                    $supervisorData['employee_first_name'],
                    $supervisorData['employee_last_name'],
                    $supervisorData['employee_email']
                );
                checkQuery($syncQuery, "There's a problem processing your request. (employee supervisor sync)");
            }

            $conn->commit();
        } catch (Throwable $th) {
            $conn->rollBack();
            returnHandleError("There's a problem processing your request.");
        }

        http_response_code(200);
        returnSuccess($val, "Direct Report Active", $query);
    }

    checkEndpoint();
}

checkAccess();
