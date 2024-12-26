import _React from "react";
import { TiPin } from "react-icons/ti";

interface ContactProps {
  image: string;
  name: string;
  message: string;
  time: string;
  isPin?: boolean;
  hasNotif?: boolean;
  totalNotif?: number;
}

function Contact(props: ContactProps) {
  return (
    <div className="flex w-full">
      <div className="p-1">
        <img
          src={props.image}
          alt={props.name}
          className="w-14 h-14 rounded-xl"
        />
      </div>
      <div className="flex-1 flex flex-col ml-1">
        <div className="w-full">
          <p className="line-clamp-1 text-md font-bold">{props.name}</p>
        </div>
        <div className="w-full">
          <p className="line-clamp-1 text-sm mt-1 text-gray-600">
            {props.message}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div>00:25</div>
        <div className="flex items-center">
          {props.hasNotif &&
            (
              <span className="bg-red-600 w-7 h-7 flex justify-center items-center rounded-full shadow-md text-sm text-white">
                {props.totalNotif ? Math.min(props.totalNotif, 99) : ""}
                {(props.totalNotif ?? 0) > 99 ? "+" : ""}
              </span>
            )}
          {props.isPin &&
            <TiPin size={24} className="text-gray-500" />}
        </div>
      </div>
    </div>
  );
}

export default Contact;
