import React from "react";
import { useNavigate } from "react-router-dom";
import "./MembershipSidebar.scss"; // Import file SCSS

export default function MemberShipSidebar() {
  const navigate = useNavigate();

  const handleStoreHistoryClick = () => {
    navigate("/membership/store-history");
  };

  const handleCustomerHistoryClick = () => {
    navigate("/membership/customer-history");
  };

  return (
    <div className="membership-sidebar">
      <div className="flex gap-4">
        <div className="sidebar-link" onClick={handleStoreHistoryClick}>
          Lịch sử giao dịch của khách hàng
        </div>
        <div className="sidebar-link" onClick={handleCustomerHistoryClick}>
          Lịch sử thanh toán bằng điểm
        </div>
      </div>
    </div>
  );
}
