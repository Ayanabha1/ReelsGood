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

export interface SeatGroupInterface {
  id: number | string;
  name: string;
  price: number | string;
}

export interface SeatInterface {
  cinema_id: number | string;
  id: number | string;
  is_seat: boolean;
  row: number | string;
  primary_id: number | string;
  seat_group: SeatGroupInterface[];
}

export interface CinemaInterface {
  id: number | string;
  name: string;
  city: string;
  state: string;
  rating: number;
  created_at: Date;
  operating_since?: Date;
  seats?: SeatInterface[];
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
