import { FC } from "react";
import { Story } from "~/modules/entity";
import { format } from "~/modules/date";

interface Props {
  data: Story;
}

const StoryCell: FC<Props> = ({ data }) => {
  return (
    <>
      <div>
        <p className={"title"}>{data.title}</p>
        <p className={"description"}>{data.description}</p>
        <p className={"createTime"}>
          {format(data.updateTime.toDate(), "YYYY/MM/DD")}
        </p>
      </div>
      <style jsx>
        {`
          div {
            cursor: pointer;
            border-radius: 8px;
            border: 0.5px solid #353535;
            padding: 12px 16px;
            height: 120px;
            grid-auto-columns: 200px;
            box-sizing: border-box;
            position: relative;
          }
          div:hover {
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }
          p {
            margin: 0;
            user-select: none;
          }
          .title {
            font-size: 16px;
            font-weight: 500;
          }
          .createTime {
            font-size: 12px;
            font-weight: 100;
            position: absolute;
            bottom: 12px;
            right: 16px;
          }
          .description {
            padding-top: 8px;
            font-size: 12px;
            font-weight: 300;
          }
        `}
      </style>
    </>
  );
};

export default StoryCell;
