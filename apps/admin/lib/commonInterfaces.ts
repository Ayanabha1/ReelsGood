import { LucideIcon } from "lucide-react";

export interface TableCellInterface {
  value: any;
  field: string;
  image?: string;
  icon?: LucideIcon;
  color?: string;
  bold?: boolean;
  isButton?: boolean;
  action?: () => void;
  metadata?: boolean; // true -> Do not show in table | false -> Show in table
}
export interface PagesInterface {
  val: number;
}

export interface CinemaInterface {
  id: number | string;
  name: string;
  city: string;
  state: string;
  rating: number;
  created_at: Date;
}

export interface MovieInterface {
  id: number | string;
  name: string;
  description: string;
  pg_rating: string;
  rating: number;
  duration: string;
  language: string;
  movie_banner: string;
  trailer_url: string;
  created_at: Date;
}
