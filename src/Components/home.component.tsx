import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from "react-router-dom";

import { useLocation, useParams } from 'react-router-dom';
import SidebarPage, { LinkInterface } from './sidebar';
import { Book } from '../assets/icon/book';
import { UserManagementIcon } from '../assets/icon/store';
import { Medal } from '../assets/icon/medal';
import { Address } from '../assets/icon/address';
import { Calender } from '../assets/icon/calendar';
import AlertContext from './alert.component';
import LoadingComponent from './loading.component';

function useCurrentURL() {
  const location = useLocation();
  const params = useParams();

  return {
    pathname: location.pathname.includes("admin") ? location.pathname : location.pathname.replace("/", ""),
    search: location.search,
    params,
  };
}

export default function HomePage() {
  const [routerList, setRouterList] = useState<LinkInterface[]>([]);
  useEffect(() => {
    setRouterList([
    {
      logo: <UserManagementIcon />,
      name: 'User',
      url: '/user-management'
    },
    {
      logo: <Book />,
      name: 'Book',
      url: '/books'
    },
    {
      logo: <Medal />,
      name: 'Brand',
      url: '/books'
    },
    {
      logo: <Address />,
      name: 'Address',
      url: '/books'
    },
    {
      logo: <Calender />,
      name: 'Calender',
      url: '/books'
    }])
  }, [])

  const [isShowAlert, setIsShowAlert] = useState(!false);
  // setIsShowAlert(!isShowAlert)
  return (
    <div>
      {/* <LoadingComponent onLoading={true} />
      <AlertContext onAlert={isShowAlert} content="Demo alert" /> */}
      <div className="grid grid-cols-12 grid-flow-row">
        <div className="lg:col-span-1 col-span-2 row-span-12">
          <SidebarPage routerList={routerList} />
        </div>
        <div className="lg:col-span-11 col-span-10 row-span-1">
          <div className="header w-full flex items-center justify-between p-2">
            <form className="max-w-md">
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.69356 12.5352C12.4234 11.375 13.6959 8.22157 12.5357 5.49174C11.3756 2.7619 8.22212 1.48942 5.49228 2.64957C2.76244 3.80972 1.48996 6.96318 2.65011 9.69302C3.81027 12.4229 6.96373 13.6953 9.69356 12.5352Z" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11.3902 11.3896L15.5556 15.5555" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>

                </div>
                <input type="search" id="default-search" className="block w-full py-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50" placeholder="Search" required />
              </div>
            </form>
            <div className="flex items-center gap-2">
              <div>
                Logout
              </div>
              <div>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.3125 7.2084C5.3125 6.91621 5.55156 6.67715 5.84375 6.67715H10.625V3.55937C10.625 3.32363 10.9105 3.2041 11.0766 3.37012L15.7781 8.12148C15.9873 8.33066 15.9873 8.66602 15.7781 8.8752L11.0766 13.6266C10.9105 13.7926 10.625 13.6764 10.625 13.4373V10.3195H5.84375C5.55156 10.3195 5.3125 10.0805 5.3125 9.78828V7.2084ZM4.25 7.2084V9.78828C4.25 10.6682 4.96387 11.382 5.84375 11.382H9.5625V13.4373C9.5625 14.616 10.9902 15.2137 11.827 14.377L16.5318 9.62891C17.1561 9.00469 17.1561 7.99531 16.5318 7.37109L11.827 2.61973C10.9936 1.78633 9.5625 2.37734 9.5625 3.55937V5.61465H5.84375C4.96387 5.61465 4.25 6.33184 4.25 7.2084ZM0 3.71875V13.2812C0 14.1611 0.713867 14.875 1.59375 14.875H5.97656C6.1957 14.875 6.375 14.6957 6.375 14.4766V14.2109C6.375 13.9918 6.1957 13.8125 5.97656 13.8125H1.59375C1.30156 13.8125 1.0625 13.5734 1.0625 13.2812V3.71875C1.0625 3.42656 1.30156 3.1875 1.59375 3.1875H5.97656C6.1957 3.1875 6.375 3.0082 6.375 2.78906V2.52344C6.375 2.3043 6.1957 2.125 5.97656 2.125H1.59375C0.713867 2.125 0 2.83887 0 3.71875Z" fill="black" />
                </svg>

              </div>
            </div>
          </div>

        </div>
        <div className="lg:col-span-11 col-span-10 row-span-11">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
