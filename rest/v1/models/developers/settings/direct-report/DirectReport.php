<?php

class DirectReport
{
    public $direct_report_aid;
    public $direct_report_is_active;
    public $direct_report_subordinate;
    public $direct_report_supervisor;
    public $direct_report_created;
    public $direct_report_updated;

    public $start;
    public $total;
    public $search;

    public $connection;
    public $lastInsertedId;

    public $tblDirectReport;
    public $tblEmployees;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblDirectReport = "settings_direct_report";
        $this->tblEmployees = "employees";
    }

    public function create()
    {
        try {
            $sql = "insert into {$this->tblDirectReport}";
            $sql .= " ( ";
            $sql .= " direct_report_is_active, ";
            $sql .= " direct_report_subordinate, ";
            $sql .= " direct_report_supervisor, ";
            $sql .= " direct_report_created, ";
            $sql .= " direct_report_updated ";
            $sql .= " ) values ( ";
            $sql .= " :direct_report_is_active, ";
            $sql .= " :direct_report_subordinate, ";
            $sql .= " :direct_report_supervisor, ";
            $sql .= " :direct_report_created, ";
            $sql .= " :direct_report_updated ";
            $sql .= " ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_is_active" => $this->direct_report_is_active,
                "direct_report_subordinate" => $this->direct_report_subordinate,
                "direct_report_supervisor" => $this->direct_report_supervisor,
                "direct_report_created" => $this->direct_report_created,
                "direct_report_updated" => $this->direct_report_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $e) {
            returnError($e->getMessage());
            $query = false;
        }

        return $query;
    }

    public function readAll()
    {
        try {
            $sql = "select ";
            $sql .= " dr.*, ";
            $sql .= " sub.employee_first_name as subordinate_first_name, ";
            $sql .= " sub.employee_last_name as subordinate_last_name, ";
            $sql .= " sup.employee_first_name as supervisor_first_name, ";
            $sql .= " sup.employee_last_name as supervisor_last_name ";
            $sql .= " from {$this->tblDirectReport} dr ";
            $sql .= " left join {$this->tblEmployees} sub on dr.direct_report_subordinate = sub.employee_aid ";
            $sql .= " left join {$this->tblEmployees} sup on dr.direct_report_supervisor = sup.employee_aid ";
            $sql .= " where true ";
            $sql .= $this->direct_report_is_active != "" ? " and dr.direct_report_is_active = :direct_report_is_active " : "";
            $sql .= $this->search != "" ? " and ( " : " ";
            $sql .= $this->search != "" ? " sub.employee_first_name like :subordinate_first_name " : " ";
            $sql .= $this->search != "" ? " or sub.employee_last_name like :subordinate_last_name " : " ";
            $sql .= $this->search != "" ? " or sup.employee_first_name like :supervisor_first_name " : " ";
            $sql .= $this->search != "" ? " or sup.employee_last_name like :supervisor_last_name " : " ";
            $sql .= $this->search != "" ? " ) " : " ";
            $sql .= " order by dr.direct_report_aid desc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->direct_report_is_active != "" ? ["direct_report_is_active" => $this->direct_report_is_active] : [],
                ...$this->search != "" ? [
                    "subordinate_first_name" => "%{$this->search}%",
                    "subordinate_last_name" => "%{$this->search}%",
                    "supervisor_first_name" => "%{$this->search}%",
                    "supervisor_last_name" => "%{$this->search}%",
                ] : [],
            ]);
        } catch (PDOException $e) {
            $query = false;
        }

        return $query;
    }

    public function readLimit()
    {
        try {
            $sql = "select ";
            $sql .= " dr.*, ";
            $sql .= " sub.employee_first_name as subordinate_first_name, ";
            $sql .= " sub.employee_last_name as subordinate_last_name, ";
            $sql .= " sup.employee_first_name as supervisor_first_name, ";
            $sql .= " sup.employee_last_name as supervisor_last_name ";
            $sql .= " from {$this->tblDirectReport} dr ";
            $sql .= " left join {$this->tblEmployees} sub on dr.direct_report_subordinate = sub.employee_aid ";
            $sql .= " left join {$this->tblEmployees} sup on dr.direct_report_supervisor = sup.employee_aid ";
            $sql .= " where true ";
            $sql .= $this->direct_report_is_active != "" ? " and dr.direct_report_is_active = :direct_report_is_active " : "";
            $sql .= $this->search != "" ? " and ( " : " ";
            $sql .= $this->search != "" ? " sub.employee_first_name like :subordinate_first_name " : " ";
            $sql .= $this->search != "" ? " or sub.employee_last_name like :subordinate_last_name " : " ";
            $sql .= $this->search != "" ? " or sup.employee_first_name like :supervisor_first_name " : " ";
            $sql .= $this->search != "" ? " or sup.employee_last_name like :supervisor_last_name " : " ";
            $sql .= $this->search != "" ? " ) " : " ";
            $sql .= " order by dr.direct_report_aid desc ";
            $sql .= " limit :start, :total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "start" => $this->start - 1,
                "total" => $this->total,
                ...$this->direct_report_is_active != "" ? ["direct_report_is_active" => $this->direct_report_is_active] : [],
                ...$this->search != "" ? [
                    "subordinate_first_name" => "%{$this->search}%",
                    "subordinate_last_name" => "%{$this->search}%",
                    "supervisor_first_name" => "%{$this->search}%",
                    "supervisor_last_name" => "%{$this->search}%",
                ] : [],
            ]);
        } catch (PDOException $e) {
            returnError($e->getMessage());
            $query = false;
        }

        return $query;
    }

    public function update()
    {
        try {
            $sql = "update {$this->tblDirectReport} set ";
            $sql .= "direct_report_subordinate = :direct_report_subordinate, ";
            $sql .= "direct_report_supervisor = :direct_report_supervisor, ";
            $sql .= "direct_report_updated = :direct_report_updated ";
            $sql .= "where direct_report_aid = :direct_report_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_subordinate" => $this->direct_report_subordinate,
                "direct_report_supervisor" => $this->direct_report_supervisor,
                "direct_report_updated" => $this->direct_report_updated,
                "direct_report_aid" => $this->direct_report_aid,
            ]);
        } catch (PDOException $e) {
            returnError($e->getMessage());
            $query = false;
        }

        return $query;
    }

    public function active()
    {
        try {
            $sql = "update {$this->tblDirectReport} set ";
            $sql .= "direct_report_is_active = :direct_report_is_active, ";
            $sql .= "direct_report_updated = :direct_report_updated ";
            $sql .= "where direct_report_aid = :direct_report_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_is_active" => $this->direct_report_is_active,
                "direct_report_updated" => $this->direct_report_updated,
                "direct_report_aid" => $this->direct_report_aid,
            ]);
        } catch (PDOException $e) {
            $query = false;
        }

        return $query;
    }

    public function delete()
    {
        try {
            $sql = "delete from {$this->tblDirectReport} ";
            $sql .= "where direct_report_aid = :direct_report_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_aid" => $this->direct_report_aid,
            ]);
        } catch (PDOException $e) {
            $query = false;
        }

        return $query;
    }

    public function readById()
    {
        try {
            $sql = "select * from {$this->tblDirectReport} where direct_report_aid = :direct_report_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_aid" => $this->direct_report_aid,
            ]);
        } catch (PDOException $e) {
            $query = false;
        }
        return $query;
    }

    public function checkDuplicateSubordinate($excludeAid = "")
    {
        try {
            $sql = "select direct_report_aid from {$this->tblDirectReport} ";
            $sql .= " where direct_report_subordinate = :direct_report_subordinate ";
            $sql .= " and direct_report_is_active = 1 ";
            $sql .= $excludeAid != "" ? " and direct_report_aid != :exclude_aid " : "";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_subordinate" => $this->direct_report_subordinate,
                ...$excludeAid != "" ? ["exclude_aid" => $excludeAid] : [],
            ]);
        } catch (PDOException $e) {
            $query = false;
        }
        return $query;
    }

    public function checkReverseAssignment($excludeAid = "")
    {
        try {
            $sql = "select direct_report_aid from {$this->tblDirectReport} ";
            $sql .= " where direct_report_subordinate = :direct_report_supervisor ";
            $sql .= " and direct_report_supervisor = :direct_report_subordinate ";
            $sql .= " and direct_report_is_active = 1 ";
            $sql .= $excludeAid != "" ? " and direct_report_aid != :exclude_aid " : "";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "direct_report_subordinate" => $this->direct_report_subordinate,
                "direct_report_supervisor" => $this->direct_report_supervisor,
                ...$excludeAid != "" ? ["exclude_aid" => $excludeAid] : [],
            ]);
        } catch (PDOException $e) {
            $query = false;
        }
        return $query;
    }

    public function readEmployeeById($employeeId)
    {
        try {
            $sql = "select * from {$this->tblEmployees} where employee_aid = :employee_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "employee_aid" => $employeeId,
            ]);
        } catch (PDOException $e) {
            $query = false;
        }
        return $query;
    }

    public function updateEmployeeSupervisorDetails(
        $subordinateId,
        $supervisorId,
        $supervisorFirstName,
        $supervisorLastName,
        $supervisorEmail
    ) {
        try {
            $sql = "update {$this->tblEmployees} set ";
            $sql .= "employee_supervisor_id = :employee_supervisor_id, ";
            $sql .= "employee_supervisor_first_name = :employee_supervisor_first_name, ";
            $sql .= "employee_supervisor_last_name = :employee_supervisor_last_name, ";
            $sql .= "employee_supervisor_email = :employee_supervisor_email, ";
            $sql .= "employee_updated = :employee_updated ";
            $sql .= "where employee_aid = :employee_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "employee_supervisor_id" => $supervisorId,
                "employee_supervisor_first_name" => $supervisorFirstName,
                "employee_supervisor_last_name" => $supervisorLastName,
                "employee_supervisor_email" => $supervisorEmail,
                "employee_updated" => date('Y-m-d H:i:s'),
                "employee_aid" => $subordinateId,
            ]);
        } catch (PDOException $e) {
            returnError($e->getMessage());
            $query = false;
        }
        return $query;
    }

    public function clearEmployeeSupervisorDetails($subordinateId)
    {
        try {
            $sql = "update {$this->tblEmployees} set ";
            $sql .= "employee_supervisor_id = '', ";
            $sql .= "employee_supervisor_first_name = '', ";
            $sql .= "employee_supervisor_last_name = '', ";
            $sql .= "employee_supervisor_email = '', ";
            $sql .= "employee_updated = :employee_updated ";
            $sql .= "where employee_aid = :employee_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "employee_updated" => date('Y-m-d H:i:s'),
                "employee_aid" => $subordinateId,
            ]);
        } catch (PDOException $e) {
            returnError($e->getMessage());
            $query = false;
        }
        return $query;
    }
}
