import { atom, DefaultValue, selectorFamily } from "recoil";

export const friendAtom = atom<{ [key: number]: any }>({
  key: "friendAtom",
  default: {},
});

export const friendSelectorById = selectorFamily<any, number>({
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
      if (newValue instanceof DefaultValue) return;
      const updatedData = get(friendAtom);
      updatedData[id] = newValue;
      set(friendAtom, updatedData);
    },
});
