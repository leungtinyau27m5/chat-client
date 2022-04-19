import { atom, DefaultValue, selector } from "recoil";
import { ChatAxios } from "src/api/chat.proto";
import { deleteCookie } from "src/utils/storages";

export declare namespace UserState {
  type Atom = Exclude<ChatAxios.Login.Response["data"], undefined>;
}

export const userAtom = atom<UserState.Atom | null>({
  key: "userAtom",
  default: null,
});

export const userSelector = selector<UserState.Atom | null>({
  key: "userSelector",
  get: ({ get }) => {
    return get(userAtom);
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue || newValue === null) {
      deleteCookie("jwt");
    }
    set(userAtom, newValue);
  },
});
