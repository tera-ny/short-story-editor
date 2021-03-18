import { FC, Fragment } from "react";
import { Story } from "~/modules/entity";
import parser from "~/modules/parser";

interface Props {
  story: Story;
}

const Preview: FC<Props> = ({ story }) => {
  return (
    <>
      <h2>{story.title}</h2>
      {parser(story.body).map((child, index) => (
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
      <style jsx>
        {`
          p {
            white-space: pre-wrap;
          }
        `}
      </style>
    </>
  );
};

export default Preview;
