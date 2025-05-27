import React, { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import AuthenPage from "../Components/authen.component";
import RoleBasedGuard from "../guards/RoleBaseGuard";
import HomePage from "../Components/home.component";
import { Role, Roles } from "../models/Role";
import { QUAN_LY, ROUTER } from "../_helpers/const/const";

// Utility function to create a lazy-loaded route
const createLazyRoute = (
  path,
  Component,
  accessibleRoles = null,
  title = null
) => {
  const RouteElement = (
    <AuthGuard>
      {accessibleRoles ? (
        <RoleBasedGuard accessibleRoles={accessibleRoles}>
          <Suspense fallback={<div>Loading...</div>}>
            {title ? (
              <HomePage title={title}>
                <Component />
              </HomePage>
            ) : (
              <Component />
            )}
          </Suspense>
        </RoleBasedGuard>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          {title ? (
            <HomePage title={title}>
              <Component />
            </HomePage>
          ) : (
            <Component />
          )}
        </Suspense>
      )}
    </AuthGuard>
  );

  return {
    path,
    element: RouteElement,
  };
};

// Lazy load các component
const AddUser = lazy(() => import("../Pages/user/addUser.page"));
const HandleCalenderPage = lazy(
  () => import("../Pages/event/pages/handle-event.page")
);
const HandlePublisher = lazy(
  () => import("../Pages/publisher/handle-publisher.page")
);
const ShowBook = lazy(() => import("../Pages/book/ShowBook"));
const AddBook = lazy(() => import("../Pages/book/AddBook"));
const ListStore = lazy(() => import("../Pages/store/list-store"));
const HandleStore = lazy(() => import("../Pages/store/handle-store"));
const ShowLocation = lazy(() => import("../Pages/location/show-location"));
const HandleLocation = lazy(() => import("../Pages/location/handle-location"));
const PublisheranagerPage = lazy(
  () => import("../Pages/publisher/publisher-manager.page")
);
const HandleAuthorPage = lazy(
  () => import("../Pages/author/handle-author.page")
);
const ShowAuthorPage = lazy(() => import("../Pages/author/show-author.page"));
const ShowGenrePage = lazy(() => import("../Pages/genre/show-genre.page"));
const HandleGenrePage = lazy(() => import("../Pages/genre/handle-genre.page"));
const ShowDistributor = lazy(
  () => import("../Pages/distributor/show-distributor.page")
);
const HandleDistributorPage = lazy(
  () => import("../Pages/distributor/handle-distributor.page")
);
const HandleCategoryPage = lazy(
  () => import("../Pages/category/handle-category.page")
);
const ShowCategoryPage = lazy(
  () => import("../Pages/category/show-category.page")
);
const HandleStreetPage = lazy(
  () => import("../Pages/street/handle-street.page")
);
const ShowStreetPage = lazy(() => import("../Pages/street/show-street.page"));
const HandleAreaPage = lazy(() => import("../Pages/area/handle-area.page"));
const ShowAreaPage = lazy(() => import("../Pages/area/show-area.page"));
const ShowUserPage = lazy(() => import("../Pages/user/User-manager.page"));
const ShowGift = lazy(() => import("../Pages/role/store/gift/show-gift"));
const HandleGift = lazy(() => import("../Pages/role/store/gift/handle-gift"));
const ShowSouvenir = lazy(() => import("../Pages/book/show-souvenir"));
const ListKios = lazy(() => import("../Pages/role/admin/kios/list-kios"));

const Membership = lazy(
  () => import("../Pages/role/manager/membership/membership")
);
const StoryHistory = lazy(
  () => import("../Pages/role/manager/membership/store-history/storeHistory")
);
const StoreHistoryDetail = lazy(
  () => import("../Pages/role/manager/membership/store-history/store-history-detail/store-history-detail")
);

const CustomerHistory = lazy(
  () =>
    import("../Pages/role/manager/membership/pay-history/pay-history")
);

const statistical = lazy(
  () =>
    import("../Pages/role/manager/membership//statistical/statistical")
);

const HandleKios = lazy(() => import("../Pages/role/admin/kios/handle-kios"));
const PointStore = lazy(
  () => import("../Pages/role/manager/manager-point/point-store")
);
const ListBrowseScores = lazy(
  () => import("../Pages/role/store/browse-scores/list-browse-scores")
);
const ProrilePage = lazy(() => import("../Pages/user/profile.page"));
const EventManagerPage = lazy(
  () => import("../Pages/event/pages/event-manager.page")
);

const ListOrderPage = lazy(
  () => import("../Pages/role/store/process-order/list-order/list-order")
);

const OngoingEventsPage = lazy(() => import("../Pages/event/pages/ongoing-events.page"));
const EventSummaryPage = lazy(() => import("../Pages/event/pages/event-summary.page"));

const user = JSON.parse(localStorage.getItem("userInfo"));
const afterLogin = () => {
  switch (user?.user?.role) {
    case Role.Admin:
      return <Navigate to={ROUTER.user.url} />;
    case Role.GiftStore:
      return <Navigate to={ROUTER.roleGiftStore.gift.url} />;
    case Role.Manager:
      return <Navigate to={ROUTER.book.url} />;
    case Role.Store:
      if (!user?.user?.storeId) {
        return (
          <div>
            <div>Quyền bị từ chối</div>
            <div>Chưa được ủy quyền</div>
          </div>
        );
      }
      return <Navigate to={ROUTER.book.url} />;
    default:
      return <AuthenPage />;
  }
};

// Define routes as a data structure
const routesConfig = [
  {
    path: "",
    element: afterLogin(),
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + "Hồ sơ"} />
      </AuthGuard>
    ),
    children: [createLazyRoute("profile/:id", ProrilePage, Roles)],
  },
  {
    path: ROUTER.book.url,
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.book.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowBook, [Role.Manager, Role.Store]),
      createLazyRoute("detail/:id", ShowBook, [Role.Manager, Role.Store]),
      createLazyRoute("list", ShowBook, [Role.Manager, Role.Store]),
      createLazyRoute("create", AddBook, [Role.Manager, Role.Store]),
      createLazyRoute("update/:id", AddBook, [Role.Manager, Role.Store]),
    ],
  },
  {
    path: "/souvenir",
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.souvenir.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowSouvenir, [Role.Manager, Role.Store]),
      createLazyRoute("detail/:id", ShowBook, [Role.Manager, Role.Store]),
      createLazyRoute("list", ShowBook, [Role.Manager, Role.Store]),
      createLazyRoute("create", AddBook, [Role.Manager, Role.Store]),
      createLazyRoute("update/:id", AddBook, [Role.Manager, Role.Store]),
    ],
  },
  {
    path: "/user-management",
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.user.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowUserPage, [Role.Admin]),
      createLazyRoute("create", AddUser, [Role.Admin]),
      createLazyRoute("update/:id", AddUser, [Role.Admin]),
    ],
  },
  {
    path: "/publisher-management",
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.publisher.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", PublisheranagerPage, [Role.Manager, Role.Store]),
      createLazyRoute("create", HandlePublisher, [Role.Manager]),
      createLazyRoute("update/:id", HandlePublisher, [Role.Manager]),
    ],
  },
  {
    path: "/event-management",
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.event.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", EventManagerPage, [Role.Manager, Role.Store]),
      createLazyRoute("create", HandleCalenderPage, [Role.Manager, Role.Store]),
      createLazyRoute("update/:id", HandleCalenderPage, [Role.Manager, Role.Store]),
      createLazyRoute("ongoing", OngoingEventsPage, [Role.Manager, Role.Store]),
      createLazyRoute("summary", EventSummaryPage, [Role.Manager]),
    ],
  },
  // Store
  {
    path: "/store-management",
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.store.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ListStore, [Role.Manager]),
      createLazyRoute("create", HandleStore, [Role.Manager]),
      createLazyRoute("update/:id", HandleStore, [Role.Manager]),
    ],
  },
  // Area
  {
    path: "/area",
    element: (
      <AuthGuard>
        <HomePage title={ROUTER.roleManager.area.name} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowAreaPage, [Role.Manager]),
      createLazyRoute("create", HandleAreaPage, [Role.Manager]),
      createLazyRoute("update/:id", HandleAreaPage, [Role.Manager]),
    ],
  },
  // Location
  {
    path: "/location",
    element: (
      <AuthGuard>
        <HomePage title={ROUTER.roleManager.location.name} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowLocation, [Role.Manager]),
      createLazyRoute("create", HandleLocation, [Role.Manager]),
      createLazyRoute("update/:id", HandleLocation, [Role.Manager]),
    ],
  },
  // Author
  {
    path: ROUTER.author.url,
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.author.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowAuthorPage, [Role.Manager]),
      createLazyRoute("create", HandleAuthorPage, [Role.Manager]),
      createLazyRoute("update/:id", HandleAuthorPage, [Role.Manager]),
    ],
  },
  // Genre
  {
    path: ROUTER.genre.url,
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.genre.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowGenrePage, [Role.Manager, Role.Store]),
      createLazyRoute("create", HandleGenrePage, [Role.Manager]),
      createLazyRoute("update/:id", HandleGenrePage, [Role.Manager]),
    ],
  },
  // Distributor
  {
    path: ROUTER.distributor.url,
    element: (
      <AuthGuard>
        <HomePage
          title={QUAN_LY + ROUTER.distributor.name.toLocaleLowerCase()}
        />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowDistributor, [Role.Manager, Role.Store]),
      createLazyRoute("create", HandleDistributorPage, [Role.Manager]),
      createLazyRoute("update/:id", HandleDistributorPage, [Role.Manager]),
    ],
  },
  // Category
  {
    path: ROUTER.category.url,
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.category.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowCategoryPage, [Role.Manager, Role.Store]),
      createLazyRoute("create", HandleCategoryPage, [Role.Manager]),
      createLazyRoute("update/:id", HandleCategoryPage, [Role.Manager]),
    ],
  },
  // Street
  {
    path: ROUTER.street.url,
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.street.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowStreetPage, [Role.Manager]),
      createLazyRoute("create", HandleStreetPage, [Role.Manager]),
      createLazyRoute("update/:id", HandleStreetPage, [Role.Manager]),
    ],
  },
  // Customer point
  {
    path: ROUTER.roleStore.customerPoint.url,
    element: (
      <AuthGuard>
        <HomePage
          title={
            QUAN_LY + ROUTER.roleStore.customerPoint.name.toLocaleLowerCase()
          }
        />
      </AuthGuard>
    ),
    children: [createLazyRoute("", ListBrowseScores, [Role.Store])],
  },
  // Gift
  {
    path: ROUTER.roleGiftStore.gift.url,
    element: (
      <AuthGuard>
        <HomePage
          title={QUAN_LY + ROUTER.roleGiftStore.gift.name.toLocaleLowerCase()}
        />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ShowGift, [Role.GiftStore]),
      createLazyRoute("create", HandleGift, [Role.GiftStore]),
      createLazyRoute("update/:id", HandleGift, [Role.GiftStore]),
    ],
  },
  // Kios
  {
    path: ROUTER.kios.url,
    element: (
      <AuthGuard>
        <HomePage title={QUAN_LY + ROUTER.kios.name.toLocaleLowerCase()} />
      </AuthGuard>
    ),
    children: [
      createLazyRoute("", ListKios, [Role.Manager]),
      createLazyRoute("create", HandleKios, [Role.Manager]),
      createLazyRoute("update/:id", HandleKios, [Role.Manager]),
    ],
  },
  // Gift history
  {
    path: ROUTER.roleAdmin.pointHistory.url,
    element: (
      <AuthGuard>
        <HomePage title={ROUTER.roleAdmin.pointHistory.name} />
      </AuthGuard>
    ),
    children: [createLazyRoute("", PointStore, [Role.Manager])],
  },
  // Membership
  {
    path: ROUTER.roleManager.memberShip.url,
    element: (
      <AuthGuard>
        <HomePage
          title={
            QUAN_LY + ROUTER.roleManager.memberShip.name.toLocaleLowerCase()
          }
        />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: (
          <RoleBasedGuard accessibleRoles={[Role.Manager]}>
            <Suspense fallback={<div>Loading...</div>}>
            <Membership />
            </Suspense>
          </RoleBasedGuard>
        ),
        children: [
          createLazyRoute("", StoryHistory, [Role.Manager]),
          createLazyRoute("order-list", ListOrderPage, [Role.Manager]),
          createLazyRoute("store-history", StoryHistory, [Role.Manager]),
          createLazyRoute("store-history/:id", StoreHistoryDetail, [Role.Manager]),
          createLazyRoute("customer-history", CustomerHistory, [Role.Manager]),
          createLazyRoute("statistical", statistical, [Role.Manager]),
        ],
      },
    ],
  },
  // ListOrderPage
  {
    path: ROUTER.roleStore.listOrder.url,
    element: (
      <AuthGuard>
        <HomePage
          title={
            QUAN_LY + ROUTER.roleManager.memberShip.name.toLocaleLowerCase()
          }
        />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: (
          <RoleBasedGuard accessibleRoles={[Role.Store, Role.Manager]}>
            <Suspense fallback={<div>Loading...</div>}>
            <ListOrderPage />
            </Suspense>
          </RoleBasedGuard>
        ),
        // children: [
        //   createLazyRoute("", StoryHistory, [Role.Manager]),
        //   createLazyRoute("store-history", StoryHistory, [Role.Manager]),
        //   createLazyRoute("customer-history", CustomerHistory, [Role.Manager]),
        // ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <AuthGuard>
        <Suspense fallback={<div>Loading...</div>}>
          {" "}
          <>Not found the page</>
        </Suspense>
      </AuthGuard>
    ),
  },
];

const router = createBrowserRouter(routesConfig);

export default router;
