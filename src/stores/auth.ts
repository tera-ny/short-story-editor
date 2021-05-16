import { atom } from "recoil";

const state = atom<{ uid?: string; subscribed: boolean }>({
  key: "auth",
  default: { uid: null, subscribed: false },
});

export default state;
