import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

export default function VendorLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/vendor");
  };

  // ✅ صفحات ممنوع يظهر فيها السايدبار
  const hideSidebarRoutes = ["/vendor", "/vendor/login", "/vendor/register"];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* ✅ السايدبار يظهر فقط لما المستخدم مسجل دخول */}
      {shouldShowSidebar && <SideBar handleLogout={handleLogout} />}

      <div className="flex-1 flex flex-col min-h-0">
        {/* ✅ النافبار يظهر دائمًا */}
        <NavBar />

        {/* ✅ محتوى الصفحات */}
        <main className="p-6 overflow-auto flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
