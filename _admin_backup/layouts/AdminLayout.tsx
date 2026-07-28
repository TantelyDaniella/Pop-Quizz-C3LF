import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.tsx";

export default function AdminLayout() {
    return (
        <div className="flex">
            <aside className="w-60 h-screen sticky inset-0 z-10 p-3 border-r border-r-gray-200 dark:border-r-gray-800">
                <AdminSidebar/>
            </aside>
            <main className="flex-1 px-10 py-3">
                <Outlet />
            </main>
        </div>
    );
}