import { Navigate, createBrowserRouter, useRoutes } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import AuthenPage from "../Components/authen.component";
import RoleBasedGuard from "../guards/RoleBaseGuard";
import { FC } from "react";
import HomePage from "../Components/home.component";
import AddUser from "../Pages/user/addUser.page";
import HandleCalenderPage from "../Pages/calender/handle-calender.page";
import CalenderManagerPage from "../Pages/calender/calender-manager.page";
import ShowUserPage from "../Pages/user/User-manager.page";
import BrandmanagerPage from "../Pages/publisher/publisher-manager.page";
import HandlePublisher from "../Pages/publisher/handle-publisher.page";
import { Role } from "../models/Role";
import ShowBook from "../Pages/book/ShowBook";
import AddBook from "../Pages/book/AddBook";
import ListStore from "../Pages/store/list-store";
import HandleStore from "../Pages/store/handle-store";
import HandleArea from "../Pages/area/handle-area";
import ShowLocation from "../Pages/location/show-location";
import HandleLocation from "../Pages/location/handle-location";
import HandleAreaPage from "../Pages/area/handle-area.page";

const router = createBrowserRouter([
  {
    path: "",
    children: [
      {
        path: "",
        element: <AuthenPage />,
      },
    ],
  },
  {
    path: "/books",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "detail/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "list",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <AddBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <AddBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/user-management",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <ShowUserPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <AddUser />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <AddUser />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/publisher-management",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <BrandmanagerPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <HandlePublisher />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <HandlePublisher />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/event-management",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <CalenderManagerPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <HandleCalenderPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin, "grand"]}>
              <HandleCalenderPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Store
  {
    path: "/store",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Store]}>
              <ListStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Store]}>
              <HandleStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Store]}>
              <HandleStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Area
  {
    path: "/area",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleArea />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleAreaPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleAreaPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Location
  {
    path: "/location",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <ShowLocation />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleLocation />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleLocation />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  { path: "*", element: <>Not found the page</> },
]);

export default router;
