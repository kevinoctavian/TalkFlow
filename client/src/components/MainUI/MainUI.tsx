import React from "react";
import Info from "./Info.tsx";
import Sidebar from "./Sidebar.tsx";

interface MainUIProps {
  children?: React.ReactNode;
  sidebarAppear?: boolean;
}

function MainUI({ children, sidebarAppear }: MainUIProps) {
  return (
    <div className="w-screen h-screen">
      <div className="flex h-full">
        <div
          className={`${
            sidebarAppear ? "block" : "hidden"
          } md:w-3/12 relative h-full md:flex overflow-hidden`}
        >
          <Sidebar />
        </div>
        <div className="flex-1 h-full">
          {children}
        </div>
        <div className="hidden md:w-1/6 h-full">
          <Info />
        </div>
      </div>
    </div>
  );
}

export default MainUI;
