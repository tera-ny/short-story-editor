import { FC, useEffect } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import Section from "~/components/ploteditor/section";
import {
  editingPlotContents,
  editingPlotState,
  editingPlotSections,
  editingPlotNodes,
  initializeContentState,
  initializePlotState,
  initializeSectionState,
  initializeNodeState,
  editingPlotSelector,
} from "~/stores/plot";

interface Props {
  template: string[];
}

const PlotEditor: FC<Props> = ({ template }) => {
  const reset = useRecoilCallback(({ snapshot, set }) => async () => {
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
  const send = useRecoilCallback(({ snapshot }) => async () => {
    const plot = await snapshot.getPromise(editingPlotSelector);
    reset();
    console.log(plot);
  });
  const [plot, setPlot] = useRecoilState(editingPlotState);
  useEffect(() => {
    if (plot.sectionTitles !== template) {
      setPlot({ ...plot, sectionTitles: template });
    }
  }, [template, plot.sectionTitles]);
  return (
    <>
      <button onClick={reset}>リセット</button>
      <button onClick={send}>送信</button>
      <div>
        {plot.sectionTitles.map((templateTitle, index) => (
          <Section
            key={index}
            index={index}
            templateTitle={templateTitle}
            isLast={template.length - 1 === index}
          />
        ))}
      </div>
      <style jsx>
        {`
          div {
            padding: 40px 20px;
            display: grid;
            position: relative;
          }
        `}
      </style>
    </>
  );
};

export default PlotEditor;
