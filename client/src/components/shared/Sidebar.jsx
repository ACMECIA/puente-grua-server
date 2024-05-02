import React from "react";
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
} from "../lib/consts/navigation";
import { NavLink as Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout } from "react-icons/hi";
import logoUrl from "./images/logo_krcp.png";
import axios from "axios";
const linkClasses =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-komatsu-blue-light no-underline hover:no-underline active:bg-komatsu-blue-light rounded-sm text-base text-decoration-none";

export default function Sidebar({ userRol }) {
  console.log(userRol);
  const handleLogout = () => {
    axios
      .get("/api/auth/logout")
      .then((res) => {
        window.location.reload(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="bg-komatsu-blue w-60 p-3 flex flex-col text-white">
      <div className="flex items-center gap-2 px-1 py-3 w-full overflow-hidden">
        <img className="object-contain w-full" src={logoUrl} alt="logo" />
      </div>

      <div className="flex-1 py-8 flex flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-100">
        {userRol === "admin"
          ? DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
              <SidebarLink key={item.key} item={item} />
            ))
          : null}

        <Link
          to={"/login"}
          onClick={handleLogout}
          className={classNames("text-red-500 cursor-pointer", linkClasses)}
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </Link>
      </div>
    </div>
  );
}

function SidebarLink({ item }) {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? "bg-komatsu-blue-light text-white"
          : "text-white",
        linkClasses
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}
