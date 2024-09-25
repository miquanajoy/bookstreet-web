import { Navigate, createBrowserRouter, useRoutes } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import AuthenPage from "../Components/authen.component";
import RoleBasedGuard from "../guards/RoleBaseGuard";
import HomePage from "../Components/home.component";
import AddUser from "../Pages/user/addUser.page";
import HandleCalenderPage from "../Pages/calender/handle-calender.page";
import CalenderManagerPage from "../Pages/calender/calender-manager.page";
import HandlePublisher from "../Pages/publisher/handle-publisher.page";
import { Role, Roles } from "../models/Role";
import ShowBook from "../Pages/book/ShowBook";
import AddBook from "../Pages/book/AddBook";
import ListStore from "../Pages/store/list-store";
import HandleStore from "../Pages/store/handle-store";
import ShowLocation from "../Pages/location/show-location";
import HandleLocation from "../Pages/location/handle-location";
import PublisheranagerPage from "../Pages/publisher/publisher-manager.page";
import { ROUTER } from "../_helpers/const/const";
import HandleAuthorPage from "../Pages/author/handle-author.page";
import ShowAuthorPage from "../Pages/author/show-author.page";
import ShowGenrePage from "../Pages/genre/show-genre.page";
import HandleGenrePage from "../Pages/genre/handle-genre.page";
import ShowDistributor from "../Pages/distributor/show-distributor.page";
import HandleDistributorPage from "../Pages/distributor/handle-distributor.page";
import HandleCategoryPage from "../Pages/category/handle-category.page";
import ShowCategoryPage from "../Pages/category/show-category.page";
import HandleStreetPage from "../Pages/street/handle-street.page";
import ShowStreetPage from "../Pages/street/show-street.page";
import HandleAreaPage from "../Pages/area/handle-area.page";
import ShowAreaPage from "../Pages/area/show-area.page";
import ListCustomerPoint from "../Pages/role/store/customer-point/list-customer-point";
import ShowUserPage from "../Pages/user/User-manager.page";
import ShowGift from "../Pages/role/store/gift/show-gift";
import HandleGift from "../Pages/role/store/gift/handle-gift";
import HandleCustomer from "../Pages/role/store/customer-point/handle-customer-point";
import ShowSouvenir from "../Pages/book/show-souvenir";
import ListKios from "../Pages/role/admin/kios/list-kios";
import HandleKios from "../Pages/role/admin/kios/handle-kios";
import PointStore from "../Pages/role/manager/manager-point/point-store";
import ListBrowseScores from "../Pages/role/store/browse-scores/list-browse-scores";
import ProrilePage from "../Pages/user/profile.page";

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
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "profile/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={Roles}>
              <ProrilePage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      }
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
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "detail/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "list",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <AddBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <ShowSouvenir />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "detail/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "list",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <ShowBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
              <AddBook />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager, Role.Store]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <PublisheranagerPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandlePublisher />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <CalenderManagerPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleCalenderPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ListStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ShowAreaPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleAreaPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ShowLocation />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleLocation />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
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
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ShowAuthorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleAuthorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleAuthorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Genre
  {
    path: ROUTER.genre.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ShowGenrePage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleGenrePage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleGenrePage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Distributor
  {
    path: ROUTER.distributor.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ShowDistributor />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleDistributorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleDistributorPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Category
  {
    path: ROUTER.category.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ShowCategoryPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleCategoryPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleCategoryPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Street
  {
    path: ROUTER.street.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ShowStreetPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleStreetPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleStreetPage />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Customer point
  {
    path: ROUTER.roleStore.customerPoint.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Store]}>
              <ListBrowseScores />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      }
    ],
  },
  // Gift
  {
    path: ROUTER.roleGiftStore.gift.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.GiftStore]}>
              <ShowGift />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.GiftStore]}>
              <HandleGift />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.GiftStore]}>
              <HandleGift />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Kios
  {
    path: ROUTER.kios.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <ListKios />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "create",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleKios />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
      {
        path: "update/:id",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <HandleKios />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  // Gift history
  {
    path: ROUTER.roleAdmin.pointHistory.url,
    element: <HomePage />,
    children: [
      {
        path: "",
        element: (
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.Manager]}>
              <PointStore />
            </RoleBasedGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  { path: "*", element: <>Not found the page</> },
]);

export default router;
