import React from "react";
import { FaBullhorn, FaCalendarAlt, FaUsers, FaUserTie } from "react-icons/fa";
import Layout from "../Layout";
import useQueryData from "../../../functions/custom-hooks/useQueryData";
import { apiVersion, formatDate } from "../../../functions/functions-general";

const getInitials = (firstName = "", lastName = "") =>
  `${firstName?.trim()?.[0] || ""}${lastName?.trim()?.[0] || ""}`.toUpperCase();

const Avatar = ({
  firstName = "",
  lastName = "",
  size = "h-10 w-10 text-xs",
}) => (
  <div
    className={`rounded-full bg-primary text-white font-semibold flex items-center justify-center shrink-0 ${size}`}
  >
    {getInitials(firstName, lastName)}
  </div>
);

const Dashboard = () => {
  const today = new Date();
  const thisMonth = today.getMonth();
  const todayDate = today.getDate();

  const { data: employeeRes } = useQueryData(
    `${apiVersion}/controllers/developers/employees/page.php?start=1`,
    "post",
    "dashboard-employees",
    {
      filterData: "",
      searchValue: "",
    },
    null,
    true
  );

  const { data: memoRes } = useQueryData(
    `${apiVersion}/controllers/developers/memo/page.php?start=1`,
    "post",
    "dashboard-memo",
    {
      filterData: "",
      searchValue: "",
    },
    null,
    true
  );

  const employees = React.useMemo(
    () =>
      (employeeRes?.data || []).filter(
        (item) => Number(item.employee_is_active) === 1
      ),
    [employeeRes]
  );

  const announcements = React.useMemo(
    () =>
      (memoRes?.data || []).filter((item) => Number(item.memo_is_active) === 1),
    [memoRes]
  );

  const birthdayToday = employees.filter((item) => {
    const date = item.employee_birthday
      ? new Date(item.employee_birthday)
      : null;
    return (
      date && date.getMonth() === thisMonth && date.getDate() === todayDate
    );
  });

  const birthdayThisMonth = employees.filter((item) => {
    const date = item.employee_birthday
      ? new Date(item.employee_birthday)
      : null;
    return date && date.getMonth() === thisMonth;
  });

  const anniversaryThisMonth = employees.filter((item) => {
    const date = item.employee_start_work_date
      ? new Date(item.employee_start_work_date)
      : null;
    return date && date.getMonth() === thisMonth;
  });

  const newEmployeesThisMonth = employees.filter((item) => {
    const date = item.employee_start_work_date
      ? new Date(item.employee_start_work_date)
      : null;
    return date && date.getMonth() === thisMonth;
  });

  const teamByDepartment = React.useMemo(() => {
    return employees.reduce((acc, item) => {
      const department = item.department_name || "Unassigned";
      if (!acc[department]) {
        acc[department] = [];
      }
      acc[department].push(item);
      return acc;
    }, {});
  }, [employees]);

  const staticWhosOut = [
    { name: "test, test", leaveType: "test Leave", days: 1 },
    { name: "test1, test2", leaveType: "test Leave", days: 2 },
  ];

  return (
    <Layout menu="dashboard">
      <div className="space-y-4">
        <h1>Dashboard</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-4 space-y-4">
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 text-primary font-semibold flex items-center gap-2">
                <FaCalendarAlt />
                <span>Who's Out</span>
              </div>
              <div className="p-4 space-y-3">
                {staticWhosOut.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="rounded-full bg-primary text-white h-9 w-9 text-xs font-semibold flex items-center justify-center">
                      {item.name
                        .split(",")
                        .map((part) => part.trim()[0] || "")
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="mb-0 font-semibold">{item.name}</p>
                      <p className="mb-0">{item.leaveType}</p>
                      <p className="mb-0">Day(s): {item.days}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 text-primary font-semibold flex items-center gap-2">
                <FaCalendarAlt />
                <span>Celebrations</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="font-semibold mb-1">Birthday Today</p>
                  {birthdayToday.length ? (
                    birthdayToday.map((item) => (
                      <div
                        key={item.employee_aid}
                        className="flex items-center gap-2 mb-2"
                      >
                        <Avatar
                          firstName={item.employee_first_name}
                          lastName={item.employee_last_name}
                          size="h-8 w-8 text-[10px]"
                        />
                        <span>
                          {item.employee_first_name} {item.employee_last_name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="mb-0 text-gray-500">
                      No birthday celebrant today.
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-semibold mb-1">Birthday This Month</p>
                  {birthdayThisMonth.length ? (
                    birthdayThisMonth.map((item) => (
                      <p key={item.employee_aid} className="mb-1">
                        {item.employee_first_name} {item.employee_last_name} (
                        {formatDate(item.employee_birthday, "--", "short-date")}
                        )
                      </p>
                    ))
                  ) : (
                    <p className="mb-0 text-gray-500">
                      No birthday this month.
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-semibold mb-1">
                    Work Anniversary This Month
                  </p>
                  {anniversaryThisMonth.length ? (
                    anniversaryThisMonth.map((item) => (
                      <p key={item.employee_aid} className="mb-1">
                        {item.employee_first_name} {item.employee_last_name} (
                        {formatDate(
                          item.employee_start_work_date,
                          "--",
                          "short-date"
                        )}
                        )
                      </p>
                    ))
                  ) : (
                    <p className="mb-0 text-gray-500">
                      No work anniversary this month.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 text-primary font-semibold flex items-center gap-2">
                <FaUserTie />
                <span>New Employees</span>
              </div>
              <div className="p-4">
                {newEmployeesThisMonth.length ? (
                  newEmployeesThisMonth.map((item) => (
                    <div
                      key={item.employee_aid}
                      className="flex items-center gap-2 mb-2"
                    >
                      <Avatar
                        firstName={item.employee_first_name}
                        lastName={item.employee_last_name}
                        size="h-8 w-8 text-[10px]"
                      />
                      <div className="min-w-0 w-full">
                        <p className="mb-0 font-semibold">
                          {item.employee_first_name} {item.employee_last_name}
                        </p>
                        <p className="mb-0 text-gray-500">
                          Started:{" "}
                          {formatDate(
                            item.employee_start_work_date,
                            "--",
                            "short-date"
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="mb-0 text-gray-500">
                    No new employees this month.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-8 space-y-4">
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 text-primary font-semibold flex items-center gap-2">
                <FaBullhorn />
                <span>Announcement</span>
              </div>
              <div className="min-h-105 max-h-155 overflow-auto">
                {announcements.length ? (
                  announcements.map((item, index) => (
                    <div
                      key={`${item.memo_aid}-${index}`}
                      className="px-4 py-3 border-b border-gray-200 last:border-b-0 flex gap-3"
                    >
                      <FaBullhorn
                        size={26}
                        className="text-3xl mt-1 shrink-0 min-w-6.5 mr-2 ml-2"
                      />
                      <div>
                        <p className="mb-1 font-semibold text-[14px]">
                          {item.memo_category || "Memo"}
                        </p>
                        <p className="mb-1 text-gray-500">
                          <span className="font-semibold text-dark">Date:</span>{" "}
                          {formatDate(item.memo_date, "--")}
                        </p>
                        <p className="mb-0 whitespace-pre-line break-all wrap-anywhere">
                          {item.memo_text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 mb-0 text-gray-500">
                    No announcements available.
                  </p>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 text-primary font-semibold flex items-center gap-2">
                <FaUsers />
                <span>My Team</span>
              </div>
              <div className="p-4 space-y-4">
                {Object.keys(teamByDepartment).length ? (
                  Object.entries(teamByDepartment).map(
                    ([departmentName, members]) => (
                      <div key={departmentName}>
                        <p className="font-semibold mb-2">{departmentName}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {members.map((member) => (
                            <div
                              key={member.employee_aid}
                              className="flex items-center gap-2"
                            >
                              <Avatar
                                firstName={member.employee_first_name}
                                lastName={member.employee_last_name}
                              />
                              <div>
                                <p className="mb-0 font-semibold">
                                  {member.employee_first_name}{" "}
                                  {member.employee_last_name}
                                </p>
                                <p className="mb-0 text-gray-500">
                                  {departmentName}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="mb-0 text-gray-500">
                    No team members available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
