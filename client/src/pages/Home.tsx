import { useState } from "react";
import ChatContinaer from "../components/ChatContinaer";
import RightSidebar from "../components/RightSidebar";
import Sidebar from "../components/Sidebar";

function Home() {
  const [selectedUser, setSelectedUser] = useState(false);
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center px-4 py-6 sm:px-[6%] sm:py-[3%]">
      <div
        className={`grid grid-cols-1 ${
          selectedUser
            ? "md:grid-cols-[1fr_1.8fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        } bg-[#0d0d12] backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden h-full w-full max-w-375 relative shadow-2xl`}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContinaer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <RightSidebar selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default Home;
