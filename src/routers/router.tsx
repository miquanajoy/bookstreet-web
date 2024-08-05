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
import PublisheranagerPage from "../Pages/publisher/publisher-manager.page";
import { ROUTER } from "../_helpers/const/const";
import HandleAuthorPage from "../Pages/author/handle-author.page";
import ShowAuthorPage from "../Pages/author/show-author.page";

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
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "detail/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <AddBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <AddBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/souvenir",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "detail/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <AddBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <ShowUserPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <AddUser />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <PublisheranagerPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandlePublisher />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <CalenderManagerPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleCalenderPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleCalenderPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Store
  {
    path: "/store-management",
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <ListStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
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
      },
      {
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
  // Author
  {
    path: ROUTER.author.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <ShowAuthorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleAuthorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Admin]}>
              <HandleAuthorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  { path: "*", element: <>Not found the page</> },
]);

export default router;
