import {
  House,
  Gamepad2,
  CircleHelp,
  Users,
  Settings,
  Trophy,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type AdminMenuItem = {
  label: string;
  path?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children?: AdminMenuItem[];
};

export const adminMenuData: AdminMenuItem[] = [
  {
    label: "Accueil",
    path: "/admin",
    icon: House,
  },
  {
    label: "Questions",
    path: "/admin/questions",
    icon: CircleHelp,
  },
  {
    label: "Joueurs",
    path: "/admin/players",
    icon: Users,
  },
  {
    label: "Quizz",
    path: "/admin/quiz",
    icon: Gamepad2,
  },
  {
    label: "Résultats",
    path: "/admin/result",
    icon: Trophy,
  },
  {
    label: "Paramètres",
    path: "/admin/setting",
    icon: Settings,
  },
];
