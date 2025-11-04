    // src/app/router.jsx
    import { createBrowserRouter, Navigate } from "react-router-dom";
    import AppShell from "./AppShell";
    import InventoryPage from "../pages/InventoryPage";
    import RegisterPage from "../pages/RegisterPage";
    import ReportsPage from "../pages/ReportsPage";

    export const router = createBrowserRouter([
    {
        element: <AppShell />, // layout con Header + NavTabs
        children: [
        { path: "/", element: <InventoryPage /> },
        {
            path: "/register",
            element: <RegisterPage />, // esta misma página tiene subpestañas internas
        },
        { path: "/register/material", element: <RegisterPage initialTab="material" /> },
        { path: "/register/teacher", element: <RegisterPage initialTab="teacher" /> },
        { path: "/reports", element: <ReportsPage /> },
        { path: "*", element: <Navigate to="/" replace /> },
        ],
    },
    ]);
