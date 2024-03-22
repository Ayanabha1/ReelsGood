import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex h-full w-full">
      <div className="w-[15%] h-full">
        <Sidebar />
      </div>
      <div className="w-[85%] flex flex-col">
        <nav>
          <Navbar />
        </nav>
        <div className="pl-6">
          <CustomBreadcrumb />
        </div>
        <section className="h-full ">{children}</section>
      </div>
    </main>
  );
};

export default layout;
