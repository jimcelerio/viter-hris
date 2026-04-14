import { MdDashboard } from "react-icons/md";
import { devNavUrl, urlDeveloper } from "../../functions/functions-general";
import { FaCogs, FaUsers } from "react-icons/fa";

export const navList = [
  {
    label: "Dashboard",
    icon: <MdDashboard />,
    menu: "dashboard",
    path: `${devNavUrl}/dashboard`,
    submenu: "",
  },
  {
    label: "Employees",
    icon: <FaUsers />,
    menu: "employees",
    path: `${devNavUrl}/employees`,
    submenu: "",
  },
  {
    label: "Settings",
    icon: <FaCogs />,
    menu: "settings",
    submenu: "",
    subNavList: [
      {
        label: "Role",
        path: `${devNavUrl}/${urlDeveloper}/settings/role`,
      },
      {
        label: "users",
        path: `${devNavUrl}/${urlDeveloper}/settings/users`,
      },
    ],
  },
];
