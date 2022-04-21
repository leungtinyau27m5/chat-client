export declare namespace Data {
  type MessageMetaType = "video" | "image";
  type UserStatus = "available" | "busy" | "leave" | "hide" | "offline";
  interface Chat {
    id: number;
    name: string;
    type: "group" | "private";
    profile_pic: string | null;
    bio: string | null;
    created: string;
    updated: string;
    // last msg data
    msg_id: number | null;
    user_id: number | null;
    username: string | null;
    email: string | null;
    message: string | null;
    media: string | null;
    meta: null | object;
    last_msg_time: string | null;
  }
  interface Message {
    id: number;
    sender_id: number;
    chat_id: number;
    message: string | null;
    media: string | null; // 2048
    meta: {
      type?: MessageMetaType;
      description?: string;
      reply?: number;
    } | null; //json?
    deleted: boolean;
    created: string;
    updated: string;
    user_id: number;
    email: string;
    username: string;
    profile_pic: string | null;
    status: UserStatus;
  }
  type SendMessage = Pick<Message, "message" | "media" | "meta">;
}
