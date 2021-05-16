import { FC, Fragment } from "react";
import parser from "~/modules/parser";

interface Props {
  text: string;
}

const Preview: FC<Props> = ({ text }) => {
  return (
    <>
      {parser(text).map((child, index) => (
        <Fragment key={index}>
          {child.type === "text" && <p>{child.body}</p>}
          {child.type === "title" && (
            <>
              {child.size === 1 && <h3>{child.body}</h3>}
              {child.size === 2 && <h4>{child.body}</h4>}
              {child.size === 3 && <h5>{child.body}</h5>}
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};

export default Preview;
