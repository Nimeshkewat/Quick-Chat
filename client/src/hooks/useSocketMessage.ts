import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export function useSocketMessages(selectedUserId: string | null) {
  const { socket } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      // if the message belongs to the currently open conversation, append it
      if (message.senderId === selectedUserId) {
        queryClient.setQueryData(
          ["messages", selectedUserId],
          (old: any[] = []) => [...old, message],
        );
      } else {
        // otherwise just bump the unseen count for that sender
        queryClient.invalidateQueries({ queryKey: ["sidebarUsers"] });
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUserId, queryClient]);
}
