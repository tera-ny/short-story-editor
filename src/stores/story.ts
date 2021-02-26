import { atomFamily, DefaultValue, selectorFamily } from "recoil";
import { Story } from "~/modules/entity";

export type SectionType = "All";

export const storyIDsState = atomFamily<string[], { type: SectionType }>({
  key: "storyIDs",
  default: [],
});

export const storyState = atomFamily<Story, { id: string }>({
  key: "story",
  default: undefined,
});

export const storiesSelector = selectorFamily<
  (Story & { id: string })[],
  { type: SectionType }
>({
  key: "stories",
  get: (param) => ({ get }) => {
    const storyIDs = get(storyIDsState(param));
    return storyIDs.map((id) => {
      const story = get(storyState({ id }));
      return { ...story, id };
    });
  },
  set: (param) => ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(storyIDsState(param), []);
    } else {
      set(
        storyIDsState(param),
        newValue.map((story) => story.id)
      );
      newValue.forEach((story) => {
        set(storyState({ id: story.id }), { ...story });
      });
    }
  },
});
