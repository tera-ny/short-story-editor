import { FC } from "react";
import Content from "~/components/ploteditor/content";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { editingPlotSections } from "~/stores/plot";
import { v4 } from "uuid";

interface Props {
  index: number;
  templateTitle: string;
  isLast: boolean;
}

const Section: FC<Props> = ({ index, templateTitle, isLast }) => {
  const section = useRecoilValue(editingPlotSections({ index }));
  const setTitle = useRecoilCallback(
    ({ set }) => (title: string) => {
      set(editingPlotSections({ index }), (oldvalue) => {
        return { ...oldvalue, title };
      });
    },
    [index]
  );
  const appendContent = useRecoilCallback(
    ({ set }) => () => {
      set(editingPlotSections({ index }), (oldValue) => {
        return { ...oldValue, contents: [...oldValue.contents, v4()] };
      });
    },
    [index]
  );
  const removeContent = useRecoilCallback(
    ({ set }) => (id: string) => {
      set(editingPlotSections({ index }), (oldValue) => {
        const contentIndex = oldValue.contents.indexOf(id);
        return {
          ...oldValue,
          contents: [
            ...oldValue.contents.slice(0, contentIndex),
            ...oldValue.contents.slice(contentIndex + 1),
          ],
        };
      });
    },
    [index]
  );
  return (
    <>
      <div className="wrapper">
        {!isLast && <hr className={"sectionBorder"} />}
        <div className={"header"}>
          <h4>-{templateTitle}-</h4>
          <input
            type="text"
            value={section.title}
            placeholder={"章題"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={"contents"}>
          <hr className={"contentBorder"} />
          {section.contents.map((contentID, contentIndex) => (
            <Content
              key={contentIndex}
              id={contentID}
              onRemove={(id) => removeContent(id)}
              isLast={section.contents.length - 1 === contentIndex}
            />
          ))}
          <button
            className={"add"}
            onClick={() => {
              appendContent();
            }}
          >
            カードを追加
          </button>
        </div>
      </div>
      <style jsx>
        {`
          .wrapper {
            position: relative;
          }
          hr {
            margin: 10px;
            border: none;
            position: absolute;
            border-left: 3px dashed #3c3c3c;
            z-index: -1;
          }
          .sectionBorder {
            top: 64px;
            bottom: 0;
            left: 20px;
          }
          .contentBorder {
            top: 10px;
            height: 60px;
            left: 40px;
            margin: 0;
          }
          h4 {
            margin: 0;
            font-size: 14px;
          }
          input {
            width: 100%;
            box-sizing: border-box;
            border: none;
            outline: none;
            font-size: 16px;
            font-weight: 500;
          }
          .header {
            border: 1px solid #3c3c3c;
            border-radius: 8px;
            color: #3c3c3c;
            background-color: white;
            padding: 8px 12px;
            height: 64px;
            box-sizing: border-box;
          }
          .contents {
            margin-left: 80px;
            display: grid;
            padding-top: 80px;
            position: relative;
          }
          .add {
            margin-bottom: 40px;
            border: none;
            border-radius: 8px;
            outline: none;
            display: flex;
            justify-content: center;
            width: 140px;
            padding: 12px 0;
            background-color: #3c3c3c;
            color: white;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
};

export default Section;
