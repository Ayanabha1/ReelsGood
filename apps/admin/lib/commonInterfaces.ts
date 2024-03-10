import { LucideIcon } from "lucide-react";

export interface TableCellInterface {
  value: string;
  image?: string;
  icon?: LucideIcon;
  color?: string;
  bold?: boolean;
  isButton?: boolean;
  action?: () => void;
}
export interface PagesInterface {
  val: number;
}
