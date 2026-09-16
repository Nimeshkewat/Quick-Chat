import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";

export function useSidebarUsers() {
  return useQuery({
    queryKey: ["sidebarUsers"],
    queryFn: async () => {
      const { data } = await api.get("/messages");
      return data as { users: any[]; unseenMessages: Record<string, number> };
    },
  });
}

export function useMessages(selectedUserId: string | null) {
  return useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: async () => {
      const { data } = await api.get(`/messages/${selectedUserId}`);
      return data.messages as any[];
    },
    enabled: !!selectedUserId,
  });
}

export function useSendMessage(selectedUserId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post(
        `/messages/send/${selectedUserId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data.newMessage;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ["messages", selectedUserId],
        (old: any[] = []) => [...old, newMessage],
      );
    },
  });
}

export function useMarkAsSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/messages/mark/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebarUsers"] });
    },
  });
}
