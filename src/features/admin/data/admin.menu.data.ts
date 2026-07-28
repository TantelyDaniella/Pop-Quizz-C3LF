import { HomeIcon } from "lucide-react";
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
    icon: HomeIcon,
  },
];
