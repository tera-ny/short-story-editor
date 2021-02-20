import { atom } from "recoil";
import { Story } from "~/modules/entity";

export const currentStoryState = atom<Story>({
  key: "currentStory",
  default: undefined,
});
