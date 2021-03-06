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
        <li>
          <p className={"primary"}>{data.title}</p>
          <p className={"secondary published"}>
            {data.isPublished ? "公開中" : "非公開"}
          </p>
          <p className={"secondary"}>
            {format(data.updateTime.toDate(), "YYYY/MM/DD")}
          </p>
        </li>
        <hr />
      </div>
      <style jsx>
        {`
          p,
          hr {
            margin: 0;
          }
          li {
            display: grid;
            grid-template-columns: 1fr 120px 70px;
            align-items: center;
            padding: 0 12px;
          }
          p {
            margin: 0;
            user-select: none;
          }
          hr {
            border: none;
            border-bottom: 1px solid #cccccc;
            margin-top: 4px;
          }
          div {
            padding-top: 12px;
          }
          div:hover {
            background-color: #f8f8f8;
          }
          .head {
            display: flex;
            justify-content: space-between;
          }
          .primary {
            font-size: 16px;
            font-weight: 500;
          }
          .secondary {
            font-size: 12px;
            font-weight: 100;
          }
          .published {
            color: ${data.isPublished ? "green" : "gray"};
          }
        `}
      </style>
    </>
  );
};

export default StoryCell;
