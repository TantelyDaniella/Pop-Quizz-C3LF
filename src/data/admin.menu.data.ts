import {
    type LucideIcon,
    HomeIcon,
} from "lucide-react";

export interface AdminMenuItem {
    id: string;
    name: string;
    icon: LucideIcon;
    path?: string;
    submenu?: AdminMenuItem[];
}

// @ts-ignore
const adminMenuData: AdminMenuItem[] = [
    {
        id: "1",
        name: "Accueil",
        icon: HomeIcon,
        path: "/admin",
    },
];

export default adminMenuData;