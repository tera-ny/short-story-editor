import { atom } from "recoil";

const state = atom<string>({
  key: "state",
  default: undefined,
});

export default state;
