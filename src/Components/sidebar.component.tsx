import { Link, NavLink, Outlet } from "react-router-dom";

import styles from '../styles/sidebar.module.css';

export interface LinkInterface {
    logo: any,
    name: string,
    url: string
}

export default function SidebarPage(prop) {
    return (
        <div className="sidebar p-2">
            <div className="info">
                <div className='mx-auto rounded-full h-10 w-10 bg-slate-50 bg-cover bg-no-repeat bg-center' style={{ backgroundImage: 'url(profile-image.jpg)' }}></div>
                <div className="text-center underline decoration-dotted">
                    Admin
                </div>
            </div>
            <ul className="p-0 text-center flex flex-column gap-6 mt-4">
                {prop.routerList.map((link) => (
                    <li key={link.url} className={styles.link}>
                        <Link to={link.url}>
                            <span className='hidden xl:inline'>
                                {link.logo}
                            </span>
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
