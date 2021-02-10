import { atom } from "recoil";
import { User } from "~/modules/entity";

interface State {
  uid: string;
  data: User;
}

const state = atom<State>({
  key: "user",
  default: undefined,
});

export default state;
