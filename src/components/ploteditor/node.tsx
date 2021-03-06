import { FC, useCallback, useRef, useState } from "react";
import { useResetRecoilState, useRecoilState } from "recoil";
import { editingPlotNodes } from "~/stores/plot";
import TextareaAutosize from "react-textarea-autosize";
import NextImage from "next/image";
import { useDrag, useDrop } from "react-dnd";

interface Props {
  id: string;
  draggableType: string;
  onRemove: (id: string) => void;
  onMove: (from: string, to: string) => void;
}

interface DraggableItemType {
  id: string;
  type: string;
}

interface DraggableItemCollect {
  isDragging: boolean;
  canDrag: boolean;
}

const Node: FC<Props> = ({ id, draggableType, onRemove, onMove }) => {
  const [node, setNode] = useRecoilState(editingPlotNodes({ id }));
  const reset = useResetRecoilState(editingPlotNodes({ id }));
  const remove = useCallback(() => {
    reset();
    onRemove(id);
  }, [id]);
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop<DraggableItemType, void, any>(
    () => ({
      accept: draggableType,
      canDrop: (item) => item.type === draggableType,
      hover: (item) => {
        if (!ref.current || item.id === id) {
          return;
        } else {
          onMove(id, item.id);
        }
      },
    }),
    [id, draggableType]
  );
  const [, drag] = useDrag<DraggableItemType, unknown, DraggableItemCollect>(
    () => ({
      item: { id, type: draggableType },
      isDragging: (monitor) => monitor.getItem().id === id,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        canDrag: monitor.canDrag(),
      }),
    }),
    [id]
  );
  drop(drag(ref));
  return (
    <>
      <div className={"container"} ref={ref}>
        <div className={"header"}>
          <button className={"close"} onClick={remove}>
            <NextImage
              src="/xmark_medium.png"
              width={50}
              height={50}
              layout="responsive"
            />
          </button>
        </div>
        <TextareaAutosize
          placeholder="間話、メインストーリーから逸れる場面など"
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
          value={node.body}
          minRows={5}
          onChange={(e) => {
            setNode({ body: e.target.value });
          }}
        ></TextareaAutosize>
      </div>
      <style jsx>{`
        .container {
          padding: 4px 0;
          border-radius: 4px;
          border: 1px solid #3c3c3c;
          background-color: white;
          cursor: grab;
        }
        .container:hover {
          box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
        }
        .header {
          height: 20px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          padding: 0 4px;
        }
        .close {
          margin: 0;
          padding: 4px;
          height: 18px;
          width: 18px;
          border: none;
          background-color: transparent;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Node;
