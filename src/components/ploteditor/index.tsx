import { FC, useEffect } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import Section from "~/components/ploteditor/section";
import {
  editingPlotState,
  editingPlotSelector,
  resetPlotState,
} from "~/stores/plot";

interface Props {
  template: string[];
}

const PlotEditor: FC<Props> = ({ template }) => {
  const reset = resetPlotState();
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
