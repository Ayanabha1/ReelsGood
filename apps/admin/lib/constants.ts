import { link } from "fs";
import {
  LayoutDashboard,
  User,
  Clapperboard,
  Film,
  Sparkles,
  SettingsIcon,
  LogOut,
} from "lucide-react";

export const sidebarOps = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    link: "/dashboard/users",
    icon: User,
  },
  {
    name: "Cinemas",
    link: "/dashboard/cinemas",
    icon: Clapperboard,
  },
  {
    name: "Movies",
    link: "/dashboard/movies",
    icon: Film,
  },
  {
    name: "Actors",
    link: "/dashboard/actors",
    icon: Sparkles,
  },
];

export const sidebarControls = [
  {
    name: "Settings",
    icon: SettingsIcon,
    link: "/dashboard/settings",
    action: undefined,
  },
  {
    name: "Log Out",
    icon: LogOut,
    link: undefined,
    action: () => {
      console.log("Logout");
    },
  },
];