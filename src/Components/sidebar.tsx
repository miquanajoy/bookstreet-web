import React, { useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";

import { useLocation, useParams } from 'react-router-dom';
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
                <img className="w-10 h-10 rounded-full m-auto" src="https://s3-alpha-sig.figma.com/img/2735/dbcd/5a9a8fa79619d5830d59f3707ff712ee?Expires=1716768000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XPVwOTL77jg7bgOp-s4Ph2pTZT-~YEnKAoSx6hIumWedHgn~X2krKfpjdgY4voTaGHGNlefGMTGkuPwKZ067UYPd4crvbiTVfOyUnaRcAmFAZkO9AKPJOERVwmGShCHAjkYuEQ6LH-FYSZ~teFpMC2HpoLkaRVb61dFjcggjGHbsBxCs6qLX2nCANuIOLJ~YuIJFmTrEqSCttHfcAXLoFVIU9YHvtVn6AD05XlUmbCbhAVHfyXs7p8U50lCv2jD4wfJneneyCqh3JddmLv0rJ9NlNyqEflVLbbdTx7z~LBrzCTb5EWhywvJJQoq8X8GHsFFUPe2ew73VRPuJSxNurg__" alt="avatar" />
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
                            {link.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
