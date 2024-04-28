import {
  LayoutDashboard,
  User,
  Clapperboard,
  Film,
  Sparkles,
  SettingsIcon,
  LogOut,
  Monitor,
  Sparkle,
  Aperture,
  Code2Icon,
  ArmchairIcon,
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
    name: "Actors",
    link: "/dashboard/actors",
    icon: Sparkles,
  },
  {
    name: "Streaming",
    link: "/dashboard/streaming",
    icon: Monitor,
  },
  {
    name: "Movies Photos",
    link: "/dashboard/movie-photos",
    icon: Aperture,
  },
  {
    name: "Movie Casting",
    link: "/dashboard/movie-casting",
    icon: Sparkle,
  },
  {
    name: "Cinema Seats",
    link: "/dashboard/cinema-seats",
    icon: ArmchairIcon,
  },
];

export const sidebarControls = [
  {
    name: "APIs",
    icon: Code2Icon,
    link: "/dashboard/apis",
    action: undefined,
  },
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
