import type { Dispatch, SetStateAction } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSidebarUsers } from "../hooks/useChat";
import { useAuth } from "../context/AuthContext";

type SidebarProps = {
  selectedUser: any;
  setSelectedUser: Dispatch<SetStateAction<any>>;
};

function Sidebar({ selectedUser, setSelectedUser }: SidebarProps) {
  const navigate = useNavigate();
  const { data } = useSidebarUsers();
  const { onlineUsers } = useAuth();
  return (
    <div
      className={`${
        selectedUser ? "max-md:hidden" : ""
      } bg-[#0d0d12] h-full p-5 border-r border-gray-800 overflow-y-auto text-white`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <img
                src={assets.logo}
                alt="logo"
                className="w-5 h-5"
                loading="lazy"
              />
            </div>
            <span className="text-lg font-semibold">QuickChat</span>
          </div>
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu_icon"
              className="max-w-5 cursor-pointer opacity-70 hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute top-full right-0 z-20 w-36 p-4 rounded-xl bg-[#17171d] border border-gray-700 text-gray-100 hidden group-hover:block shadow-lg">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-violet-400"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-700" />
              <p className="cursor-pointer text-sm hover:text-violet-400">
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#17171d] rounded-full flex items-center gap-2 py-2.5 px-4 mt-5 border border-gray-800">
          <img
            src={assets.search_icon}
            className="w-3.5 opacity-60"
            alt="search_icon"
          />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 flex-1"
            placeholder="Search User..."
          />
        </div>

        <div className="flex flex-col mt-4 gap-1">
          {data?.users.map((user, index) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            return (
              <div
                onClick={() => setSelectedUser(user)}
                key={user._id}
                className={`${
                  isSelected
                    ? "bg-violet-600/20 border border-violet-600/40"
                    : "border border-transparent hover:bg-white/5"
                } relative flex items-center gap-3 p-2.5 pl-3 rounded-xl cursor-pointer transition-colors`}
              >
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user?.fullName}
                  className="w-11 h-11 rounded-full aspect-square object-cover"
                />
                <div className="flex flex-col leading-5">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <span
                    className={`text-xs ${isOnline ? "text-green-400" : "text-gray-500"}`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                {index > 2 && (
                  <p className="ml-auto text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500 text-white font-medium">
                    {index}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
