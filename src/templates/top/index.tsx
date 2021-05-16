import { FC } from "react";
import Profile from "~/components/profile";
import StoryList from "~/components/storylist";

const Top: FC = () => {
  return (
    <>
      <div>
        <div className={"container"}>
          <div className={"profileContainer"}>
            <Profile />
          </div>
          <StoryList type="All" />
        </div>
      </div>
      <style jsx>
        {`
          .container {
            padding: 40px 20px 0;
            box-sizing: border-box;
            width: 100%;
          }
          @media screen and (min-width: 0) and (max-width: 719px) {
            .profileContainer {
              padding-bottom: 40px;
            }
          }
          @media screen and (min-width: 720px) {
            .container {
              display: grid;
              grid-template-columns: 25% auto;
              max-width: 1480px;
              margin: 0 auto;
              gap: 20px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Top;
