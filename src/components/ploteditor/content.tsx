import { FC, useCallback, useMemo, useState } from "react";
import { useRecoilCallback, useRecoilValue, useResetRecoilState } from "recoil";
import { v4 } from "uuid";
import { editingPlotContents } from "~/stores/plot";
import Node from "~/components/ploteditor/node";
import NextImage from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import arrayMove from "array-move";

interface Props {
  id: string;
  onRemove: (id: string) => void;
  isLast: boolean;
}

const Content: FC<Props> = ({ id, onRemove, isLast }) => {
  const content = useRecoilValue(editingPlotContents({ id }));
  const setBody = useRecoilCallback(
    ({ set }) => (body: string) => {
      set(editingPlotContents({ id }), (oldValue) => {
        return { ...oldValue, body };
      });
    },
    [id]
  );
  const body = useMemo(() => content.body, [content.body]);
  const [hideDropDownMenu, setHideDropDownMenu] = useState(true);
  const toggleDropDownMenu = useCallback(() => {
    setHideDropDownMenu(!hideDropDownMenu);
  }, [hideDropDownMenu]);

  const reset = useResetRecoilState(editingPlotContents({ id }));
  const remove = useCallback(() => {
    reset();
    onRemove(id);
  }, [id, onRemove]);

  const appendNodes = useRecoilCallback(
    ({ set }) => () => {
      set(editingPlotContents({ id }), (oldValue) => {
        return {
          ...oldValue,
          nodeIDs: [...oldValue.nodeIDs, v4()],
        };
      });
    },
    [id]
  );
  const removeNode = useRecoilCallback(
    ({ set }) => (nodeID: string) => {
      set(editingPlotContents({ id }), (oldValue) => {
        const index = oldValue.nodeIDs.indexOf(nodeID);
        return {
          ...oldValue,
          nodeIDs: [
            ...oldValue.nodeIDs.slice(0, index),
            ...oldValue.nodeIDs.slice(index + 1),
          ],
        };
      });
    },
    [id]
  );
  const moveNode = useRecoilCallback(
    ({ set }) => (from: string, to: string) => {
      set(editingPlotContents({ id }), (oldValue) => {
        const fromIndex = oldValue.nodeIDs.indexOf(from);
        const toIndex = oldValue.nodeIDs.indexOf(to);
        return {
          ...oldValue,
          nodeIDs: arrayMove(oldValue.nodeIDs, fromIndex, toIndex),
        };
      });
    }
  );
  return (
    <>
      <div className={"wrapper"}>
        <div
          tabIndex={0}
          className={"container"}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setHideDropDownMenu(true);
            }
          }}
        >
          <div className={"header"}>
            <button className={"option"} onClick={toggleDropDownMenu}>
              <NextImage
                src={"/triple_dot_fill_dark_gray.png"}
                width={300}
                height={100}
                layout={"responsive"}
              />
            </button>
          </div>
          <div className={"content"}>
            <TextareaAutosize
              placeholder={"ストーリーの核となるイベント、お話"}
              value={body}
              style={{
                width: "100%",
                border: "none",
                boxSizing: "border-box",
                resize: "none",
                outline: "none",
                padding: "0 12px",
                fontSize: "14px",
                lineHeight: "150%",
              }}
              minRows={5}
              onFocus={() => {
                setHideDropDownMenu(true);
              }}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          {!hideDropDownMenu && (
            <div className={"dropDownMenu"}>
              <div className={"options"}>
                <button
                  onClick={() => {
                    appendNodes();
                  }}
                >
                  ノードを追加
                </button>
                <hr />
                <button
                  onClick={() => {
                    toggleDropDownMenu();
                    remove();
                  }}
                >
                  このカードを削除する
                </button>
              </div>
            </div>
          )}
        </div>

        {isLast && content.nodeIDs.length === 0 ? (
          <div className={"spacer"}></div>
        ) : (
          <div className={"nodes"}>
            {!isLast && <hr className={"contentBorder"} />}
            {content.nodeIDs.map((contentID, index) => (
              <Node
                key={index}
                id={contentID}
                draggableType={id}
                onMove={moveNode}
                onRemove={removeNode}
              />
            ))}
          </div>
        )}
      </div>
      <style jsx>
        {`
          .contentBorder {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 40px;
            border: none;
            border-left: 3px dashed #3c3c3c;
            z-index: -1;
          }
          .container {
            border: 1px solid #3c3c3c;
            position: relative;
            border-radius: 8px;
            outline: none;
          }
          .header {
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .content textarea {
            width: 100%;
            border: none;
            box-sizing: border-box;
          }
          .option {
            height: 20px;
            padding: 4px;
            margin-right: 4px;
            width: 34px;
            border: none;
            background-color: transparent;
            outline: none;
            cursor: pointer;
          }
          .spacer {
            height: 40px;
          }
          .nodes {
            padding-top: 40px;
            padding-left: 80px;
            padding-bottom: 40px;
            display: grid;
            gap: 20px;
            position: relative;
          }
          .dropDownMenu {
            z-index: 999;
            position: absolute;
            top: 32px;
            left: auto;
            right: 4px;
            background-color: white;
            width: 200px;
            border: 1px solid #3c3c3c;
            border-radius: 4px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
          }
          .dropDownMenu::before {
            position: absolute;
            content: "";
            border: 8px solid transparent;
            border-bottom: 8px solid #3c3c3c;
            top: -16px;
            right: 4px;
            left: auto;
          }
          .dropDownMenu::after {
            position: absolute;
            content: "";
            border: 7px solid transparent;
            border-bottom: 7px solid white;
            top: -14px;
            right: 5px;
            left: auto;
          }
          .options {
            overflow: hidden;
            border-radius: 2px;
            display: flex;
            flex-direction: column;
          }
          .options > button {
            margin: 0;
            background-color: transparent;
            height: 32px;
            border: none;
            text-align: start;
            cursor: pointer;
            box-sizing: border-box;
            outline: none;
          }
          .options > button:hover {
            background-color: #3c3c3c;
            color: white;
          }
          .options > hr {
            margin: 0;
            width: 100%;
            border: none;
            border-bottom: 1px solid #3c3c3c;
          }
        `}
      </style>
    </>
  );
};

export default Content;
