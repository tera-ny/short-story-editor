import { atom, atomFamily, selector, useRecoilCallback } from "recoil";
import { v4 } from "uuid";
import {
  Plot,
  PlotContent,
  PlotContentWithNodes,
  PlotSection,
} from "~/modules/entity";

export const resetPlotState = () => {
  return useRecoilCallback(({ snapshot, set }) => async () => {
    const plot = await snapshot.getPromise(editingPlotState);
    const sections = await Promise.all(
      plot.sectionTitles.map(async (_, index) =>
        snapshot.getPromise(editingPlotSections({ index }))
      )
    );
    const contents = sections.map((section) => section.contents).flat();
    const nodes = (
      await Promise.all(
        contents.map(
          async (id) =>
            (await snapshot.getPromise(editingPlotContents({ id }))).nodeIDs
        )
      )
    ).flat();
    sections.forEach((_, index) => {
      set(editingPlotSections({ index }), initializeSectionState());
    });
    contents.forEach((id) => {
      set(editingPlotContents({ id }), initializeContentState);
    });
    nodes.forEach((id) => set(editingPlotNodes({ id }), initializeNodeState));
    set(editingPlotState, initializePlotState);
  });
};

export const editingPlotSelector = selector<
  Omit<Plot, "createTime" | "updateTime">
>({
  key: "Editing/Plot",
  get: ({ get }) => {
    const plot = get(editingPlotState);
    const sections = plot.sectionTitles
      .map<Omit<PlotSection, "contents"> & { contents: string[] }>(
        (templateTitle, index) => ({
          ...get(editingPlotSections({ index })),
          templateTitle,
        })
      )
      .map<PlotSection>((section) => {
        const contents = section.contents.map<PlotContentWithNodes>((id) => {
          const content = get(editingPlotContents({ id }));
          const nodes = content.nodeIDs.map((id) =>
            get(editingPlotNodes({ id }))
          );
          return { body: content.body, nodes };
        });
        return {
          title: section.title,
          templateTitle: section.templateTitle,
          contents: contents,
        };
      });
    return {
      title: plot.title,
      memo: plot.memo,
      updateTime: plot.updateTime,
      createTime: plot.createTime,
      sections: sections,
    };
  },
});

export const initializePlotState: Omit<Plot, "sections"> & {
  sectionTitles: string[];
} = { title: "", memo: undefined, sectionTitles: [] };

export const initializeSectionState = (): Omit<
  PlotSection,
  "contents" | "templateTitle"
> & { contents: string[] } => ({ title: "", contents: [v4()] });

export const initializeContentState: PlotContent & { nodeIDs: [] } = {
  body: "",
  nodeIDs: [],
};

export const initializeNodeState: PlotContent = { body: "" };

export const editingPlotState = atom<
  Omit<Plot, "sections"> & { sectionTitles: string[] }
>({
  key: "Editing/Plot/Title",
  default: initializePlotState,
});

export const editingPlotSections = atomFamily<
  Omit<PlotSection, "contents" | "templateTitle"> & { contents: string[] },
  { index: number }
>({
  key: "Editing/Plot/Sections",
  default: initializeSectionState,
});

export const editingPlotContents = atomFamily<
  PlotContent & { nodeIDs: string[] },
  { id: string }
>({
  key: "Editing/Plot/Contents",
  default: initializeContentState,
});

export const editingPlotNodes = atomFamily<PlotContent, { id: string }>({
  key: "Editing/Plot/Nodes",
  default: initializeNodeState,
});

export const Templates = {
  first: ["起", "承", "転", "結"],
  secondary: ["序", "破", "急"],
};
