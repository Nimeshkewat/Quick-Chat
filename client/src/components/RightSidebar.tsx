import assets, { imagesDummyData } from "../assets/assets";

function RightSidebar({ selectedUser }: { selectedUser: any }) {
  return (
    selectedUser && (
      <div
        className={`bg-[#0d0d12] text-white w-full h-full relative overflow-y-auto border-l border-gray-800 ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-10 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="profilePic"
            className="w-20 h-20 aspect-square rounded-full object-cover"
          />
          <h1 className="px-10 text-lg font-medium mx-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {selectedUser?.fullName}
          </h1>
          <p className="px-10 mx-auto text-center text-gray-400">
            {selectedUser?.bio || "Hi Everyone, I am Using QuickChat"}
          </p>
        </div>

        <hr className="border-gray-800 my-5 mx-5" />

        <div className="px-5 text-xs">
          <p className="text-gray-300 font-medium mb-3">Media</p>
          <div className="max-h-72 overflow-y-auto grid grid-cols-2 gap-3">
            {imagesDummyData.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded-lg overflow-hidden aspect-square hover:opacity-80 transition-opacity"
              >
                <img
                  src={url}
                  alt="image"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <button className="w-full bg-linear-to-r from-purple-500 to-violet-600 text-white border-none text-sm font-medium py-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity">
            Logout
          </button>
        </div>
      </div>
    )
  );
}

export default RightSidebar;
