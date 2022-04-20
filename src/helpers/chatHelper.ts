import { formatDate } from "./common";

export const getMsgDate = (timestamp: string) => {
  const ms = new Date(timestamp).getTime();
  const date = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setHours(-24, 0, 0, 0);
  if (ms >= yesterday && ms <= date) {
    return `yesterday ${formatDate(ms, "HH:mm:ss")}`;
  }
  if (ms >= date) {
    return `${formatDate(ms, "HH:mm:ss")}`;
  }
  return `${formatDate(ms, "yyyy/MM/dd HH:mm:ss")}`;
};
