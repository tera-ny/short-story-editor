import { atom } from "recoil";
import firebase from "~/modules/firebase";

const state = atom<string>({
  key: "state",
  default: undefined,
});

export default state;
