import _React from "react";
import { FaSearch } from "react-icons/fa";
import Contact from "./Contact.tsx";

function Sidebar() {
  return (
    <div className="h-screen w-[inherit] fixed top-0 left-0 p-3 overflow-y-auto border border-l-gray-950">
      <div className="relative mb-5">
        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none">
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          className="rounded-md focus:shadow-2xl p-1 w-full bg-blue-100 border border-blue-900 text-sm focus:ring-blue-400 block ps-10"
          placeholder="Search friend?"
        />
      </div>
      <div className="flex flex-col gap-y-3">
        {Array(10).fill(1).map((_, i) => (
          <Contact
            key={i}
            image="/pp0.jpg"
            message="Ini adalah misi rahasia"
            name="Kevin Oc"
            time="00:43"
            hasNotif
            isPin
            totalNotif={Math.floor(Math.random() * 100 + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
