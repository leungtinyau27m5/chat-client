import { atom } from "recoil";

export const menuAtom = atom({
  key: "menuAtom",
  default: true,
});

export const appbarAtom = atom({
  key: "appbarAtom",
  default: true,
});
