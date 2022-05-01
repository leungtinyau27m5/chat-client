import { atom, DefaultValue, selectorFamily } from "recoil";
import { Data } from "src/shared/data.proto";

export type MessageAtom = { [chatId: number]: Data.Message[] };

export const messageListAtom = atom<MessageAtom>({
  key: "messageListAtom",
  default: {},
});

export const messageListMetaAtom = atom<{
  [chatId: number]: {
    offset: number;
    total: number;
    page: number;
  };
}>({
  key: "messageListMetaAtom",
  default: {},
});

export const messageListMetaSelectorByChatId = selectorFamily<
  { offset: number; total: number; page: number } | null,
  number
>({
  key: "messageListMetaSelectorByChatId",
  get:
    (chatId) =>
    ({ get }) => {
      const data = get(messageListMetaAtom);
      if (data[chatId]) return data[chatId];
      return null;
    },
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

export const lastMessageSelector = selectorFamily<Data.Message | null, number>({
  key: "lastMessageSelector",
  get:
    (chatId) =>
    ({ get }) => {
      const list = get(messageListSelectorByChatId({ chatId }));
      if (list.length) return list[list.length - 1];
      return null;
    },
});
