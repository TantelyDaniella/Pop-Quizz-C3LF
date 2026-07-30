import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>
      <p className="small-text p-4">USER LAYOUTS...</p>
      <Outlet />
    </div>
  );
}
