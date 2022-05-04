import { atom, selectorFamily } from "recoil";
import { Data } from "src/shared/data.proto";

export const memberListAtom = atom<{ [chatId: number]: Data.Member[] }>({
  key: "memberListAtom",
  default: {},
});

export const memberMetaAtom = atom<{
  [chatId: number]: {
    offset: number;
    total: number;
    page: number;
  };
}>({
  key: "memberMetaAtom",
  default: {},
});

export const memberMetaSelectorByChatId = selectorFamily<
  { offset: number; total: number; page: number } | null,
  number
>({
  key: "memberMetaSelectorByChatId",
  get:
    (chatId) =>
    ({ get }) => {
      const data = get(memberMetaAtom);
      if (data[chatId]) return data[chatId];
      return null;
    },
});

export const memberListAtomSelectorByChatId = selectorFamily<
  Data.Member[],
  number
>({
  key: "memberListAtomSelectorByChatId",
  get:
    (chatId) =>
    ({ get }) => {
      const rawData = get(memberListAtom);
      if (rawData[chatId]) return rawData[chatId];
      return [];
    },
});
