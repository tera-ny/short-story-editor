import { FC, useEffect } from "react";
import Profile from "~/components/profile";
import StoryList from "~/components/storylist";

const Top: FC = () => {
  useEffect(() => {});
  return (
    <>
      <div>
        <div className={"container"}>
          <Profile />
          <StoryList type="All" />
        </div>
      </div>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: 25% auto;
            max-width: 1480px;
            width: 100%;
            margin: 0 auto;
            gap: 20px;
            box-sizing: border-box;
            padding: 40px 20px 0;
          }
        `}
      </style>
    </>
  );
};

export default Top;
