import { atom } from "recoil";
import { Story } from "~/modules/entity";

interface State {
  id: string;
  data: Story;
}

const state = atom<State[]>({
  key: "stories",
  default: [],
});

export default state;
