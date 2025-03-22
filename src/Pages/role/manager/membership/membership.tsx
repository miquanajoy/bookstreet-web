import React from "react";
import { Link, Outlet } from "react-router-dom"; // Import Outlet
import MemberShipSidebar from "./member-sidebar.page";
import useMembershipHook from "./useMembershipHook";

export default function Membership() {
  const {
    data,
    handleClickOpenDetail,
    deleteItem,
    fetAllData,
    formData,
    setFormData,
    eventStatus,
    setEventStatus,
  } = useMembershipHook();

  return (
    <>
      <MemberShipSidebar />
      <div>
        <Outlet />
      </div>
    </>
  );
}
