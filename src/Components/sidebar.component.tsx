import { Link, NavLink, Outlet } from "react-router-dom";

import styles from '../styles/sidebar.module.css';
import { accountService } from "../_services";

export interface LinkInterface {
    logo: any,
    name: string,
    url: string,
    roles: string[]
}

export default function SidebarPage(prop) {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    return (
        <div className="sidebar pt-2">
            <div className="flex items-center gap-2 px-6">
                <div className='rounded-full h-10 w-10 bg-slate-50 bg-cover bg-no-repeat bg-center' style={{ backgroundImage: 'url("https://mdbootstrap.com/img/new/avatars/8.jpg")' }}></div>
                <div className="text-sm">{user.user.fullName ?? ''}</div>
            </div>
            <ul className="p-0 text-center flex flex-column mt-4">
                {prop.routerList.map((link) => (
                    link.roles.includes(user.role) ?
                        <li key={link.url} className={`${styles.link}`}>
                            <NavLink to={link.url} className={({ isActive }) => (isActive ? `${styles.active} px-6 py-2` : ' px-6 py-2')}
                            >
                                <span className='hidden xl:inline'>
                                    {link.logo}
                                </span>
                                {link.name}
                            </NavLink >
                        </li>
                        : <div key={link.url}></div>
                ))}
            </ul>
        </div>
    );
}
