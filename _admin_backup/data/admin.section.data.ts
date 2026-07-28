// src/config/adminNavigation.ts

import type { LucideIcon } from "lucide-react";
import {
  List,
  Globe,
  Terminal,
  Code2,
  Users,
  UserCheck,
  UserX,
  LayoutDashboard,
  Trophy,
  BarChart3,
  History,
  Clock3,
  PlayCircle,
  CheckCircle2
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const adminSections = {
  questions: [
    {
      label: "Toutes les questions",
      path: "/admin/questions",
      icon: List,
    },
    {
      label: "Culture générale",
      path: "/admin/questions/general-knowledge",
      icon: Globe,
    },
    {
      label: "Commandes Linux",
      path: "/admin/questions/linux-commands",
      icon: Terminal,
    },
    {
      label: "Programmation Shell",
      path: "/admin/questions/shell-programming",
      icon: Code2,
    },
  ],

  players: [
    {
      label: "Tous les joueurs",
      path: "/admin/players",
      icon: Users,
    },
    {
      label: "Joueurs actifs",
      path: "/admin/players/active",
      icon: UserCheck,
    },
    {
      label: "Joueurs inactifs",
      path: "/admin/players/inactive",
      icon: UserX,
    },
  ],

  quiz: [
    {
      label: "Vue d'ensemble",
      path: "/admin/quiz",
      icon: LayoutDashboard,
    },
    {
    label: "En attente",
    path: "/admin/quiz/waiting",
    icon: Clock3,
  },
  {
    label: "En cours",
    path: "/admin/quiz/running",
    icon: PlayCircle,
  },
  {
    label: "Terminé",
    path: "/admin/quiz/finished",
    icon: CheckCircle2,
  }
  ],

  results: [
    {
      label: "Classement",
      path: "/admin/results/leaderboard",
      icon: Trophy,
    },
    {
      label: "Statistiques",
      path: "/admin/results/statistics",
      icon: BarChart3,
    },
    {
      label: "Historique",
      path: "/admin/results/history",
      icon: History,
    },
  ],
};