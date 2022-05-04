import { atom, DefaultValue, selectorFamily } from "recoil";
import { Data } from "src/shared/data.proto";

export const friendAtom = atom<{ [key: number]: Data.Friend }>({
  key: "friendAtom",
  default: {},
});

export const friendChatMappedAtom = atom<{ [chatId: number]: number[] }>({
  key: "friendChatMappedAtom",
  default: {},
});

export const friendSelectorById = selectorFamily<Data.Friend | null, number>({
  key: "friendSelectorById",
  get:
    (id) =>
    ({ get }) => {
      const data = get(friendAtom);
      if (data[id]) return data[id];
      return null;
    },
  set:
    (id) =>
    ({ get, set }, newValue) => {
      if (newValue instanceof DefaultValue || newValue === null) return;
      const updatedData = get(friendAtom);
      updatedData[id] = newValue;
      set(friendAtom, updatedData);
    },
});
