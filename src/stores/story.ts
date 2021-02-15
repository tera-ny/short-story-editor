import { atom } from "recoil";
import { Story } from "~/modules/entity";

interface State {
  id: string;
  data: Story;
}

const state = atom<State[]>({
  key: "story",
  default: [],
});

export default state;
