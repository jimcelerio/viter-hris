import { MdDashboard } from "react-icons/md";
import { devNavUrl, urlDeveloper } from "../../functions/functions-general";
import { FaClipboardList, FaCogs, FaUsers } from "react-icons/fa";

export const navList = [
  {
    label: "Dashboard",
    icon: <MdDashboard />,
    menu: "dashboard",
    path: `${devNavUrl}/${urlDeveloper}/dashboard`,
    submenu: "",
  },
  {
    label: "Employees",
    icon: <FaUsers />,
    menu: "employees",
    path: `${devNavUrl}/${urlDeveloper}/employees`,
    submenu: "",
  },
  {
    label: "Memo",
    icon: <FaClipboardList />,
    menu: "memo",
    path: `${devNavUrl}/${urlDeveloper}/memo`,
    submenu: "",
  },
  {
    label: "Settings",
    icon: <FaCogs />,
    menu: "settings",
    submenu: "",
    subNavList: [
      {
        label: "Roles",
        path: `${devNavUrl}/${urlDeveloper}/settings/users/roles`,
      },
      {
        label: "users",
        path: `${devNavUrl}/${urlDeveloper}/settings/users`,
      },
    ],
  },
];
