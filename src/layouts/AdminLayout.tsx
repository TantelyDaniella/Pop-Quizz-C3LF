import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
      <div className="min-h-screen flex bg-(--bg-main)">
          <div className="sticky top-0 h-screen shrink-0">
              <AdminSidebar />
          </div>
          <main className="flex-1 p-6 overflow-auto">
              <Outlet />
          </main>
      </div>
  );
}
