import { Link, NavLink, Outlet } from "react-router-dom";

import styles from "../styles/sidebar.module.css";
import { accountService } from "../_services";
import { searchService } from "../_services/search.service";
import { AVATARDEFAULT } from "../_helpers/const/const";

export interface LinkInterface {
  logo: any;
  name: string;
  url: string;
  roles: string[];
}

export default function SidebarPage(prop) {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  function updateSearchValue() {
    searchService.setValueSearch(undefined);
  }
  return (
    <div className="sidebar pt-2">
      <Link to={`/profile/` + user.userId}>
        <div className="flex items-center gap-2 px-6">
          <div
            className="rounded-full min-h-10 min-w-10 h-10 w-10 bg-slate-50 bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${
                user.user.avatar ? user.user.avatar : AVATARDEFAULT
              })`,
            }}
          ></div>
          <div className="text-sm text-dark">{user.user.fullName ?? ""}</div>
        </div>
      </Link>
      <ul className="p-0 text-center flex flex-column mt-4">
        {prop.routerList.map((link) =>
          link.roles.includes(user.role) ? (
            <li
              key={link.url}
              onClick={() => {
                updateSearchValue();
              }}
              className={`${styles.link}`}
            >
              <NavLink
                to={link.url}
                className={({ isActive }) =>
                  isActive ? `${styles.active} px-6 py-2` : " px-6 py-2"
                }
              >
                <div>{link.logo()}</div>
                {link.name}
              </NavLink>
            </li>
          ) : (
            <div key={link.url}></div>
          )
        )}
      </ul>
    </div>
  );
}
