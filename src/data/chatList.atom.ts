import { atom, DefaultValue, selectorFamily } from "recoil";
import { Data } from "src/shared/data.proto";

export type ChatRoomMeta = {
  top: number;
  unread: number;
};

export const initChatRoomMeta = () => {
  return {
    top: 0,
    unread: 0,
  };
};

export const chatListAtom = atom<{ [key: number]: Data.Chat }>({
  key: "chatListAtom",
  default: {},
});

export const chatMetaAtom = atom({
  key: "chatMetaAtom",
  default: {
    offset: -1,
    limit: -1,
    total: -1,
  },
});

export const chatRoomMetaAtom = atom<{ [key: number]: ChatRoomMeta | null }>({
  key: "chatRoomMetaAtom",
  default: {},
});

export const chatRoomMetaSelectorById = selectorFamily<
  ChatRoomMeta | null,
  number
>({
  key: "chatRoomMetaSelectorById",
  get:
    (id) =>
    ({ get }) => {
      const data = get(chatRoomMetaAtom);
      if (data[id]) return data[id];
      return null;
    },
  set:
    (id) =>
    ({ set }, newValue) => {
      if (newValue instanceof DefaultValue || newValue === null) {
        set(chatRoomMetaAtom, (state) => ({
          ...state,
          [id]: null,
        }));
        return;
      }
      set(chatRoomMetaAtom, (state) => ({
        ...state,
        [id]: newValue,
      }));
    },
});

export const chatListSelectorByType = selectorFamily<
  Data.Chat[],
  "group" | "private"
>({
  key: "chatListSelectorByType",
  get:
    (type) =>
    ({ get }) => {
      const raw = get(chatListAtom);
      const list = Object.keys(raw).reduce((arr, key) => {
        const nKey = Number(key);
        if (raw[nKey].type === type) arr.push(raw[nKey]);
        return arr;
      }, [] as Data.Chat[]);
      return list;
    },
});

export const chatListSelectorById = selectorFamily<Data.Chat, number>({
  key: "chatListSelectorById",
  get:
    (id) =>
    ({ get }) => {
      return get(chatListAtom)[id];
    },
  set:
    (id) =>
    ({ set }, newValue) => {
      if (newValue instanceof DefaultValue) {
        set(chatListAtom, {});
        return;
      }
      set(chatListAtom, (state) => ({
        ...state,
        [id]: newValue,
      }));
    },
});
