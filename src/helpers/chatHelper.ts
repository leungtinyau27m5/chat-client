import { formatDate } from "./common";

export const getMsgDate = (timestamp: string) => {
  const ms = new Date(timestamp).getTime();
  const date = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date().setHours(-24, 0, 0, 0);
  const ampm = new Date(timestamp).getHours() > 12 ? 'pm' : 'am'
  if (ms >= yesterday && ms <= date) {
    return `yesterday ${formatDate(ms, "HH:mm:ss")} ${ampm}`;
  }
  if (ms >= date) {
    return `${formatDate(ms, "HH:mm:ss")} ${ampm}`;
  }
  return `${formatDate(ms, "yyyy/MM/dd HH:mm:ss")} ${ampm}`;
};
