import { setSession } from "src/utils/storages";
import { formatDate } from "./common";

export const getMsgDate = (timestamp: string) => {
  const ms = new Date(timestamp).getTime();
  const date = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setHours(-24, 0, 0, 0);
  // const ampm = new Date(timestamp).getHours() > 12 ? "pm" : "am";
  if (ms >= yesterday && ms <= date) {
    return {
      date: "Yesterday",
      time: formatDate(ms, "HH:mm"),
    };
  }
  if (ms >= date) {
    return {
      date: "Today",
      time: formatDate(ms, "HH:mm"),
    };
  }
  return {
    date: formatDate(ms, "yyyy/MM/dd"),
    time: formatDate(ms, "HH:mm"),
  };
};

export const saveScrollHeight = (chatId: number, height: number) => {
  setSession(chatId.toString(), height.toString());
};
