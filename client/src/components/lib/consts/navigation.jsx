import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineAnnotation,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
} from "react-icons/hi";

import { FaTools } from "react-icons/fa";

import { FaBell } from "react-icons/fa";

import { MdCalendarMonth } from "react-icons/md";

import { AiOutlineLineChart } from "react-icons/ai";

import { IoIosStats } from "react-icons/io";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "sistema",
    label: "Estatus de Sistema",
    path: "/",
    icon: <HiOutlineViewGrid />,
  },
  {
    key: "mensual",
    label: "Estatus Mensual",
    path: "/mensual",
    icon: <MdCalendarMonth />,
  },
  {
    key: "analysis",
    label: "Análisis de Operación",
    path: "/analysis",
    // pon el icono color blanco
    icon: <IoIosStats />,
  },
  {
    key: "operation",
    label: "Estatus de Operación",
    path: "/operation",
    icon: <AiOutlineLineChart />,
  },
  // {
  //   key: "manteinance",
  //   label: "Mantenimiento",
  //   path: "/maintenance",
  //   icon: <FaTools />,
  // },

  // {
  //   key: "alerts",
  //   label: "Alertas",
  //   path: "/alerts",
  //   icon: <FaBell />,
  // },
];

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: <HiOutlineCog />,
  },
];
