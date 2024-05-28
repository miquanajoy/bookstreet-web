import { Navigate, createBrowserRouter, useRoutes } from "react-router-dom"
import AuthGuard from "../guards/AuthGuard";
import AuthenPage from "../Components/authen.component";
import RoleBasedGuard from "../guards/RoleBaseGuard";
import { FC } from "react";
import HomePage from "../Components/home.component";
import ShowBook from "../Pages/ShowBook";
import AddBook from "../Pages/AddBook";

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
            path: '/dashboard',
            element: <HomePage />,
            children: [
                {
                    path: '',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={["admin", "grand", "store"]}>
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
                            <RoleBasedGuard accessibleRoles={["admin", "grand", "store"]}>
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
                            <RoleBasedGuard accessibleRoles={["admin", "grand", "store"]}>
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
                            <RoleBasedGuard accessibleRoles={["admin", "grand", "store"]}>
                                <AddBook />
                            </RoleBasedGuard >
                        </AuthGuard>
                    ),
                },
            ],
        },
        { path: '*', element: <>Not found the page</> }
    ]);



export default router;