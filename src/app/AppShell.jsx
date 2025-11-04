    // src/app/AppShell.jsx
    import { Outlet, useLocation, NavLink } from "react-router-dom";
    import Header from "../components/Header";

    export default function AppShell() {
    const dateStr = new Date().toLocaleDateString("es-AR", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

    const tabClass = ({ isActive }) =>
        "border-b-2 py-4 px-1 text-sm font-medium " +
        (isActive ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300");

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
        <Header user="Administrador" dateStr={dateStr} />

        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
            <NavLink to="/" className={tabClass} end>Inventario</NavLink>
            <NavLink to="/register/material" className={tabClass}>Registrar Material</NavLink>
            <NavLink to="/register/teacher" className={tabClass}>Registrar Profesor</NavLink>
            <NavLink to="/reports" className={tabClass}>Informes y Movimientos</NavLink>
            </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
        </main>
        </div>
    );
    }
