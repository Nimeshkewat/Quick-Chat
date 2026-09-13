import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

function Profile() {
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const [name, setName] = useState("Martin Johnson");
  const [bio, setBio] = useState("Hi Everyone, I am Using QuickChat");

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // handle save
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden px-4">
      {/* glow background */}
      <div className="absolute top-0 right-1/4 w-150 h-150 bg-violet-700/40 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-1/4 w-125500px] bg-indigo-700/30 rounded-full blur-[120px]"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center bg-[#0d0d12]/70 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full">
        {/* Left form */}
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 p-8 w-full md:w-105"
        >
          <h2 className="text-xl font-semibold text-white">Profile details</h2>

          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files?.[0] || null)}
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt="profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <span className="text-sm text-gray-300">upload profile image</span>
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="bg-transparent border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500 transition-colors"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            required
            rows={4}
            className="bg-transparent border border-violet-500 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 outline-none resize-y transition-colors"
          />

          <button
            type="submit"
            className="bg-linear-to-r from-purple-400 to-violet-600 text-white font-medium text-sm py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </form>

        {/* Right image placeholder */}
        <div className="hidden md:flex flex-1 h-full items-center justify-center p-8 bg-white/5">
          {/* TODO: replace with actual illustration/image */}
          <div className="w-full aspect-square max-w-70 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-sm">
            Image placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
