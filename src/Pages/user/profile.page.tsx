import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { alertService } from "../../_services/alert.service";
import config from "../../config";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { Role, Roles } from "../../models/Role";
import { fileService } from "../../_services/file.service";
import { Box, Tab, Tabs } from "@mui/material";
import CustomTabPanel from "../../Components/customTabPanel";
import AddUser from "./addUser.page";
import HandleStore from "../store/handle-store";
// import { alertService, onAlert } from '../_services';

export default function ProrilePage() {
 const userLocal = JSON.parse(localStorage.getItem("userInfo"))?.user;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabList() {
    if (userLocal.role == Role.Store) {
      return (
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Cập nhât thông tin store" />
          <Tab label="câp nhât thông tin tài khoản" />
        </Tabs>
      );
    } else if (userLocal.role == Role.Manager) {
      return <></>;
    }
  }
  function TabPanelByRole() {
    if (userLocal.role == Role.Store) {
      return (
        <>
          <CustomTabPanel value={value} index={0}>
            <HandleStore storeId={userLocal.storeId} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AddUser userId={userLocal.id}/>
          </CustomTabPanel>
        </>
      );
    } else if (userLocal.role == Role.Manager) {
      return <></>;
    }
  }

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList />
        <TabPanelByRole />
      </Box>
    </div>
  );
}
