import { FC } from "react";
import Editor from "~/components/ploteditor";
import { Templates } from "~/stores/plot";

const Template: FC = () => {
  return (
    <>
      <div>
        <Editor template={Templates.first} />
      </div>
      <style jsx>
        {`
          div {
            max-width: 1480px;
            width: 100%;
            margin: 0 auto;
          }
        `}
      </style>
    </>
  );
};

export default Template;
