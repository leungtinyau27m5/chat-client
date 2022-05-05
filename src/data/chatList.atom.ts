import { atom, DefaultValue, selectorFamily } from "recoil";
import { Data } from "src/shared/data.proto";

export const chatListAtom = atom<{ [chatId: number]: Data.Chat }>({
  key: "chatListAtom",
  default: {},
});

export const chatUnreadAtom = atom<{ [chatId: number]: number[] }>({
  key: "chatUnReadAtom",
  default: {},
});

export const chatRoomScrollTopAtom = atom<{ [chatId: number]: number | null }>({
  key: "chatRoomScrollTopAtom",
  default: {},
});


export const chatListMetaAtom = atom<{
  offset: number;
  total: number;
  limit: number;
} | null>({
  key: "chatListMetaAtom",
  default: null,
});

export const chatHashToIdSelector = selectorFamily<number, string | null>({
  key: "chatHashToIdSelector",
  get:
    (hash) =>
    ({ get }) => {
      if (hash === null) return -1;
      const data = get(chatListAtom);
      for (const key in data) {
        if (data[key].hash === hash) return Number(key);
      }
      return -1;
    },
});

export const chatSelectorByHash = selectorFamily<
  Data.Chat | null,
  string | null
>({
  key: "chatSelectorByHash",
  get:
    (hash) =>
    ({ get }) => {
      if (!hash) return null;
      const data = get(chatListAtom);
      const target = Object.entries(data).find(
        ([key, value]) => value.hash === hash
      );
      if (target) {
        const [, result] = target;
        return result;
      }
      return null;
    },
});

export const chatUnreadSelectorById = selectorFamily<number[], number>({
  key: "chatUnreadSelectorById",
  get:
    (chatId) =>
    ({ get }) => {
      const data = get(chatUnreadAtom);
      if (data[chatId]) return data[chatId];
      return [];
    },
  set:
    (chatId) =>
    ({ get, set }, newValue) => {
      if (newValue instanceof DefaultValue) {
        set(chatUnreadAtom, (state) => ({
          ...state,
          [chatId]: [],
        }));
        return;
      }
      set(chatUnreadAtom, (state) => ({
        ...state,
        [chatId]: newValue,
      }));
    },
});

export const chatRoomScrollTopSelectorById = selectorFamily<
  number | null,
  number
>({
  key: "chatRoomMetaSelectorById",
  get:
    (id) =>
    ({ get }) => {
      const data = get(chatRoomScrollTopAtom);
      if (data[id]) return data[id];
      return null;
    },
  set:
    (id) =>
    ({ set }, newValue) => {
      if (newValue instanceof DefaultValue || newValue === null) {
        set(chatRoomScrollTopAtom, (state) => ({
          ...state,
          [id]: null,
        }));
        return;
      }
      set(chatRoomScrollTopAtom, (state) => ({
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
        if (raw[nKey].type === type) {
          arr.push(raw[nKey]);
        }
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
