import { MdDashboard } from "react-icons/md";
import { devNavUrl, urlDeveloper } from "../../functions/functions-general";
import { FaUsers } from "react-icons/fa";

export const navList = [
  {
    label: "Dashboard",
    icon: <MdDashboard />,
    menu: "dashboard",
    submenu: "",
  },
  {
    label: "Employees",
    icon: <FaUsers />,
    menu: "employees",
    submenu: "",
    subNavList: [
      {
        label: "Role",
        path: `${devNavUrl}/${urlDeveloper}/settings/roles`,
      },
      {
        label: "users",
        path: `${devNavUrl}/${urlDeveloper}/settings/users`,
      },
    ],
  },
];
