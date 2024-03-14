import { link } from "fs";
import {
  LayoutDashboard,
  User,
  Clapperboard,
  Film,
  Sparkles,
  SettingsIcon,
  LogOut,
  Monitor,
  StarIcon,
  Sparkle,
  Aperture,
} from "lucide-react";

export const sidebarOps = [
  {
    name: "Dashboard",
    link: "/dashboard/main",
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
    name: "Movies Photos",
    link: "/dashboard/movies/movie-picture",
    icon: Aperture,
  },
  {
    name: "Movie Casting",
    link: "/dashboard/movie-casting",
    icon: Sparkle,
  },
  {
    name: "Streaming",
    link: "/dashboard/streaming",
    icon: Monitor,
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

export const items_per_page = 5;
