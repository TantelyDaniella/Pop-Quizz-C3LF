import { useNavigate } from "react-router-dom";
import { adminMenuData } from "@/features/admin/data/admin.menu.data";
import { useNavigation } from "@/app/context/NavigationContext";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { page } = useNavigation();

  return (
    <aside className="w-60 shrink-0 border-r border-(--border-color) p-4 flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2 mb-4">
        <img src="/linux-pop-quizz.svg" alt="logo" className="w-8 h-8" />
        <span className="font-medium text-sm">Admin</span>
      </div>
      {adminMenuData.map((item) => {
        const Icon = item.icon;
        const active = item.path && page.startsWith(item.path);
        return (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={active ? "menu-item-active" : "menu-item"}
          >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            {item.label}
          </button>
        );
      })}
    </aside>
  );
}
