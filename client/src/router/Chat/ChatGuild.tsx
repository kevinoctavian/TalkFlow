import { useEffect, useState } from "react";
import MainUI from "../../components/MainUI/MainUI.tsx";
import {
  IoBug,
  IoCallOutline,
  IoSearchSharp,
  IoSendSharp,
} from "react-icons/io5";
import { RxDotsVertical } from "react-icons/rx";
import { RiEmotionLine } from "react-icons/ri";
import { LiaPaperclipSolid } from "react-icons/lia";

function Home() {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/gateway/?token=hello");
    ws.onopen = () => {
      console.log("connect");
    };
  }, []);

  return (
    <MainUI sidebarAppear={toggleSidebar}>
      <div className="flex flex-col justify-between h-dvh overflow-hidden">
        <div className="flex h-14 px-2 border border-b-gray-400 shadow-lg z-10 items-center">
          <div className="block md:hidden w-8 h-8 mr-3">
            <button
              className="bg-emerald-300 w-full h-full"
              onClick={() => setToggleSidebar(!toggleSidebar)}
            >
              <IoBug size={28} />
            </button>
          </div>
          <div className="flex-1 flex items-center gap-x-3">
            <img
              src="/pp0.jpg"
              alt="Kevin Oc"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-lg font-bold text-gray-800">Kevin Oc</p>
              <p className="text-sm text-green-500 flex gap-x-1 items-center">
                <RiEmotionLine />Online
              </p>
            </div>
          </div>
          <div className="flex justify-evenly items-center gap-x-5 text-gray-500">
            <IoSearchSharp size={28} />
            <IoCallOutline size={28} />
            <RxDotsVertical size={28} />
          </div>
        </div>

        <div className="px-2 py-2 mb-auto text-black flex flex-col gap-y-3.5 overflow-y-auto">
          <div className="bg-green-600 rounded-lg w-fit">
            <p className="text-white p-2">Test</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">Anjay masuk abangku</p>
          </div>

          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">P</p>
          </div>
          <div className="bg-green-600 rounded-lg ml-auto w-fit">
            <p className="text-white p-2 text-right">last</p>
          </div>
        </div>

        <div className="bg-neutral-400 rounded-md h-14 px-2 flex items-center gap-x-4 border border-t-gray-400 text-zinc-700">
          <div>
            <LiaPaperclipSolid size={22} />
          </div>
          <div className="flex-1 h-full">
            <input
              type="text"
              className="border-none w-full h-full focus:ring-0 outline-none bg-transparent placeholder:text-zinc-600"
              placeholder="Send Message"
            />
          </div>
          <div>
            <IoSendSharp size={22} />
          </div>
        </div>
      </div>
    </MainUI>
  );
}

export default Home;
