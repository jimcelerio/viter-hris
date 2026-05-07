<?php

$conn = null;
$conn = checkDbConnection();
$val = new DirectReport($conn);

if (array_key_exists("id", $_GET)) {
    $val->direct_report_aid = $_GET['id'];
    $val->direct_report_subordinate = trim($data['direct_report_subordinate']);
    $val->direct_report_supervisor = trim($data['direct_report_supervisor']);
    $val->direct_report_updated = date('Y-m-d H:i:s');

    checkPayload($data);
    checkIndex($data, 'direct_report_subordinate');
    checkIndex($data, 'direct_report_supervisor');
    checkId($val->direct_report_aid);

    $existingRecordQuery = $val->readById();
    if (!$existingRecordQuery || $existingRecordQuery->rowCount() == 0) {
        returnHandleError("Invalid request, direct report record does not exist.");
    }
    $existingRecord = $existingRecordQuery->fetch(PDO::FETCH_ASSOC);

    if ($val->direct_report_subordinate == $val->direct_report_supervisor) {
        returnHandleError("Invalid request, subordinate and supervisor cannot be the same person.");
    }

    $subordinateDuplicate = $val->checkDuplicateSubordinate($val->direct_report_aid);
    if ($subordinateDuplicate && $subordinateDuplicate->rowCount() > 0) {
        returnHandleError("Invalid request, subordinate already has a supervisor assigned.");
    }

    $reverseAssignment = $val->checkReverseAssignment($val->direct_report_aid);
    if ($reverseAssignment && $reverseAssignment->rowCount() > 0) {
        returnHandleError("Invalid request, the supervisor cannot be assigned to the selected subordinate.");
    }

    $subordinateQuery = $val->readEmployeeById($val->direct_report_subordinate);
    $supervisorQuery = $val->readEmployeeById($val->direct_report_supervisor);

    if (!$subordinateQuery || $subordinateQuery->rowCount() == 0) {
        returnHandleError("Invalid request, selected subordinate does not exist.");
    }

    if (!$supervisorQuery || $supervisorQuery->rowCount() == 0) {
        returnHandleError("Invalid request, selected supervisor does not exist.");
    }

    $supervisorData = $supervisorQuery->fetch(PDO::FETCH_ASSOC);

    $conn->beginTransaction();

    try {
        $query = checkUpdate($val);

        if ($existingRecord['direct_report_subordinate'] != $val->direct_report_subordinate) {
            $clearOldSubordinateQuery = $val->clearEmployeeSupervisorDetails($existingRecord['direct_report_subordinate']);
            checkQuery($clearOldSubordinateQuery, "There's a problem processing your request. (old subordinate clear)");
        }

        $queryEmployeeSync = $val->updateEmployeeSupervisorDetails(
            $val->direct_report_subordinate,
            $val->direct_report_supervisor,
            $supervisorData['employee_first_name'],
            $supervisorData['employee_last_name'],
            $supervisorData['employee_email']
        );
        checkQuery($queryEmployeeSync, "There's a problem processing your request. (employee supervisor sync)");

        $conn->commit();
    } catch (Throwable $th) {
        $conn->rollBack();
        returnHandleError("There's a problem processing your request.");
    }

    http_response_code(200);
    returnSuccess($val, "Direct Report Update", $query);
}

checkEndpoint();
