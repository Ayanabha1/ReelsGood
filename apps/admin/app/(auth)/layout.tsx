import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center h-[100vh]">{children}</div>
  );
};

export default layout;
