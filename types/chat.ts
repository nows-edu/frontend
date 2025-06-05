export type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  subtitle?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
};

export type Chat = {
  id: string;
  participants: ChatUser[];
  lastMessage: string;
  unreadCount?: number;
  updatedAt: Date;
};

export type ChatListItem = ChatUser & {
  lastMessage: string;
  unreadCount?: number;
};
