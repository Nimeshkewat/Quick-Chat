import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import assets from "../assets/assets";
import { formatMessageTimed } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useMessages, useSendMessage } from "../hooks/useChat";
import { useSocketMessages } from "../hooks/useSocketMessage";

type ChatContainerPropts = {
  selectedUser: any;
  setSelectedUser: Dispatch<SetStateAction<any>>;
};

function ChatContinaer({ selectedUser, setSelectedUser }: ChatContainerPropts) {
  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const { authUser } = useAuth();
  const { data: messages } = useMessages(selectedUser?._id ?? null);
  const sendMessage = useSendMessage(selectedUser?._id ?? null);
  useSocketMessages(selectedUser?._id ?? null);

  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (image) formData.append("image", image);

    sendMessage.mutate(formData);
    setText("");
    setImage(null);
  };

  return selectedUser ? (
    <div className="h-full w-full flex flex-col relative bg-[#0b0b10]">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 px-5 border-b border-gray-800">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-9 h-9 rounded-full object-cover"
        />
        <p className="flex-1 text-base font-medium text-white flex items-center gap-2">
          {selectedUser?.fullName}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-6 cursor-pointer"
          alt="arrow_icon"
        />
        <img
          src={assets.help_icon}
          className="max-md:hidden max-w-5 opacity-70 hover:opacity-100 cursor-pointer"
          alt="help_icon"
        />
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col overflow-y-auto px-5 py-4 gap-1">
        {messages?.map((msg) => {
          const isMe = msg.senderId === authUser?._id;
          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 mb-5 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <div className="flex flex-col items-center text-xs">
                  <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    alt="profile"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <p className="text-gray-500 mt-1">
                    {formatMessageTimed(msg.createdAt)}
                  </p>
                </div>
              )}

              {msg.image ? (
                <img
                  src={msg.image}
                  alt="image"
                  className="max-w-60 border border-gray-700 rounded-2xl overflow-hidden"
                />
              ) : (
                <p
                  className={`${
                    isMe ? "rounded-br-md" : "rounded-bl-md"
                  } px-4 py-3 max-w-70 text-sm font-light rounded-2xl breakwrap-break-wordiolet-600/30 text-white`}
                >
                  {msg.text}
                </p>
              )}

              {isMe && (
                <div className="flex flex-col items-center text-xs">
                  <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    alt="profile"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <p className="text-gray-500 mt-1">
                    {formatMessageTimed(msg.createdAt)}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* bottom */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 p-4 border-t border-gray-800"
      >
        <div className="flex flex-1 items-center bg-[#17171d] px-4 py-1 rounded-full border border-gray-800">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Send a message"
            className="flex-1 text-sm py-2.5 bg-transparent border-none outline-none text-white placeholder-gray-500"
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="gallery_icon"
              className="w-5 mr-1 cursor-pointer opacity-70 hover:opacity-100"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-500 transition-colors"
        >
          <img src={assets.send_button} alt="send_button" className="w-5" />
        </button>
      </form>
    </div>
  ) : (
    <div className="flex flex-col h-full w-full items-center justify-center gap-3 text-gray-500 bg-[#0b0b10] max-md:hidden">
      <img src={assets.logo} alt="logo" className="max-w-16 opacity-70" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
}

export default ChatContinaer;
