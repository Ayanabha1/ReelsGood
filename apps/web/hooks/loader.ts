import { loadingInterfaceType } from "@/CommonInterfaces/shared_interfaces";
import { create } from "zustand";

export const useLoader = create<loadingInterfaceType>((set) => ({
  loading: false,
  setLoading: (state: boolean) => {
    set({ loading: state });
  },
}));
