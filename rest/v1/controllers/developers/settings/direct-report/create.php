<?php

$conn = null;
$conn = checkDbConnection();
$val = new DirectReport($conn);

$val->direct_report_is_active = 1;
$val->direct_report_subordinate = trim($data['direct_report_subordinate']);
$val->direct_report_supervisor = trim($data['direct_report_supervisor']);
$val->direct_report_created = date('Y-m-d H:i:s');
$val->direct_report_updated = date('Y-m-d H:i:s');

checkPayload($data);
checkIndex($data, 'direct_report_subordinate');
checkIndex($data, 'direct_report_supervisor');

if ($val->direct_report_subordinate == $val->direct_report_supervisor) {
    returnHandleError("Invalid request, subordinate and supervisor cannot be the same person.");
}

$subordinateDuplicate = $val->checkDuplicateSubordinate();
if ($subordinateDuplicate && $subordinateDuplicate->rowCount() > 0) {
    returnHandleError("Invalid request, subordinate already has a supervisor assigned.");
}

$reverseAssignment = $val->checkReverseAssignment();
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
    $query = $val->create();
    checkQuery($query, "There's a problem processing your request. (create)");

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
returnSuccess($val, "Direct Report Create", $query);
