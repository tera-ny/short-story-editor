import { atom } from "recoil";
import { Story } from "~/modules/entity";

export const currentStoryIDState = atom<string>({
  key: "currentStoryID",
  default: undefined,
});

export const currentStoryState = atom<Story>({
  key: "currentStory",
  default: undefined,
});
