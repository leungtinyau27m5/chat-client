import { atom, DefaultValue, selectorFamily } from "recoil";
import { Data } from "src/shared/data.proto";

export const messageListAtom = atom<{ [key: number]: Data.Message[] }>({
  key: "messageListAtom",
  default: {},
});

export const messageListSelectorByChatId = selectorFamily<
  Data.Message[],
  {
    chatId: number;
    isMerge?: boolean;
  }
>({
  key: "messageListSelectorByChatId",
  get:
    (param) =>
    ({ get }) => {
      const { chatId } = param;
      const data = get(messageListAtom);
      if (data[chatId]) return data[chatId];
      return [];
    },
  set:
    (param) =>
    ({ get, set }, newValue) => {
      const { chatId, isMerge } = param;
      if (newValue instanceof DefaultValue) return;
      const updatedData = get(messageListAtom);
      let list = [...updatedData[chatId]];
      if (isMerge) {
        list = list.concat(newValue);
      } else {
        list = newValue;
      }
      set(messageListAtom, {
        ...updatedData,
        [chatId]: list,
      });
    },
});