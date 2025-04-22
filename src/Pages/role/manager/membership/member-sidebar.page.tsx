import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./MembershipSidebar.scss"; // Import file SCSS

export default function MemberShipSidebar() {
  const navigate = useNavigate();

  return (
    <div className="membership-sidebar">
      <div className="flex gap-4">
        <NavLink
          // className="sidebar-link"
          to="/membership/order-list"
          className={({ isActive }) =>
            isActive ? `sidebar-link px-6 py-2` : " sidebar-link border-0 px-6 py-2"
          }
        >
          Xem toàn bộ đơn hàng
        </NavLink>
        <NavLink
          // className="sidebar-link"
          to="/membership/store-history"
          className={({ isActive }) =>
            isActive ? `sidebar-link px-6 py-2` : " sidebar-link border-0 px-6 py-2"
          }
        >
          Xem đơn hàng theo cửa hàng
        </NavLink>
        <NavLink
          // className="sidebar-link"
          to="/membership/customer-history"
          className={({ isActive }) =>
            isActive ? `sidebar-link px-6 py-2` : " sidebar-link border-0 px-6 py-2"
          }
        >
          Lịch sử thanh toán
        </NavLink>
      </div>
    </div>
  );
}
