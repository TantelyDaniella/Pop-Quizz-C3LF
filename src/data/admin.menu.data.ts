import {
    type LucideIcon,
    House,
    Gamepad2,
    CircleHelp,
    Users,
    Settings,
    Trophy
} from "lucide-react";

export interface AdminMenuItem {
    id: string;
    name: string;
    icon: LucideIcon;
    path?: string;
    submenu?: AdminMenuItem[];
}

const adminMenuData: AdminMenuItem[] = [
    {
        id: "1",
        name: "Accueil",
        icon: House,
        path: "/admin",
    },
 
    {
        id: "2",
        name: "Questions",
        icon: CircleHelp,
        path: "/admin/question",
    },
    {
        id: "3",
        name: "Joueurs",
        icon: Users,
        path: "/admin/player",
    },
       {
        id: "4",
        name: "Quizz",
        icon: Gamepad2,
        path: "/admin/quizz",
    },
    {
        id: "5",
        name: "Résultats",
        icon: Trophy,
        path: "/admin/result",
    },
    {
        id: "6",
        name: "Paramètres",
        icon: Settings,
        path: "/admin/setting",
    },
];

export default adminMenuData;