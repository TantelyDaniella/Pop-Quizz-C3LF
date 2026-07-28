import adminMenuData, { type AdminMenuItem } from "../data/admin.menu.data";
import { useNavigation } from "../context/NavigationContext";
import {useState} from "react";
import {ChevronDown} from "lucide-react";

export default function AdminSidebar() {
    const { page, navigateTo } = useNavigation();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = (id: string) => {
        setOpenSubmenu(prev => prev === id ? null : id);
    };

    return (
        <div>
            <div>
                Hello
            </div>
            <div className="border-t border-t-gray-800/8 my-3"></div>
            <div className="flex flex-col gap-1">
                {adminMenuData.map((item: AdminMenuItem) => (
                    <div key={item.id}>
                        <button
                            className={page === item.path ? "menu-item-active" : "menu-item"}
                            onClick={() => { item.submenu ? toggleSubmenu(item.id) : navigateTo(item.path); }}>
                            <item.icon size={25} className={"bg-(--primary)/5 p-1 rounded-lg"} />
                            <span className="flex-1 text-left">
                                {item.name}
                            </span>
                            {
                                item.submenu && (
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${openSubmenu === item.id ? "rotate-180" : ""}`}
                                    />)
                            }
                        </button>
                        {item.submenu && openSubmenu === item.id && (
                            <div className="flex flex-col gap-1 ml-4 mt-1">
                                {item.submenu.map((sub: AdminMenuItem) => (
                                    <button
                                        key={sub.id}
                                        className={page === sub.path ? "menu-item-active" : "menu-item"}
                                        onClick={() => navigateTo(sub.path)}>
                                        <sub.icon size={14} />
                                        {sub.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}