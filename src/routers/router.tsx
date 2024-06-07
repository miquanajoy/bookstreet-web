import { Navigate, createBrowserRouter, useRoutes } from "react-router-dom"
import AuthGuard from "../guards/AuthGuard";
import AuthenPage from "../Components/authen.component";
import RoleBasedGuard from "../guards/RoleBaseGuard";
import { FC } from "react";
import HomePage from "../Components/home.component";
import ShowBook from "../Pages/ShowBook";
import AddBook from "../Pages/AddBook";
import AddUser from "../Pages/user/addUser.page";
import BrandmanagerPage from "../Pages/brand/brand-manager.page";
import ShowUserPage from "../Pages/user/user-manager.page";
import HandleBrand from "../Pages/brand/handle-brand.page";
import HandleCalenderPage from "../Pages/calender/handle-calender.page";
import CalenderManagerPage from "../Pages/calender/calender-manager.page";

const router =
    createBrowserRouter([
        {
            path: '',
            children: [
                {
                    path: '',
                    element: (
                        <AuthenPage />
                    ),
                },
            ],
        },
        {
            path: '/books',
            element: <HomePage />,
            children: [
                {
                    path: '',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <ShowBook />
                            </RoleBasedGuard>
                        </AuthGuard>
                    ),
                },
                {
                    path: 'detail/:id',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <ShowBook />
                            </RoleBasedGuard>
                        </AuthGuard>
                    ),
                },
                {
                    path: 'list',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin"]}>
                                <ShowBook />
                            </RoleBasedGuard>
                        </AuthGuard>
                    ),
                },
                {
                    path: 'create', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <AddBook />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
                {
                    path: 'update/:id', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <AddBook />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
            ],
        },
        {
            path: '/user-management',
            element: <HomePage />,
            children: [
                {
                    path: '',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <ShowUserPage />
                            </RoleBasedGuard>
                        </AuthGuard>
                    ),
                },
                {
                    path: 'create', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <AddUser />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
                {
                    path: 'update/:id', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <AddUser />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
            ],
        },
        {
            path: '/brand-management',
            element: <HomePage />,
            children: [
                {
                    path: '',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <BrandmanagerPage />
                            </RoleBasedGuard>
                        </AuthGuard>
                    ),
                },
                {
                    path: 'create', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <HandleBrand />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
                {
                    path: 'detail/:id', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <ShowBook />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
            ],
        },
        {
            path: '/calender-management',
            element: <HomePage />,
            children: [
                {
                    path: '',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <CalenderManagerPage />
                            </RoleBasedGuard>
                        </AuthGuard>
                    ),
                },
                {
                    path: 'create', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <HandleCalenderPage />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
                {
                    path: 'update/:id', element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand"]}>
                                <HandleCalenderPage />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
            ],
        },
        { path: '*', element: <>Not found the page</> }
    ]);



export default router;