import { FC, useEffect } from "react";
import Profile from "~/components/profile";

const Top: FC = () => {
  useEffect(() => {});
  return (
    <>
      <div>
        <div className={"container"}>
          <Profile />
          <div>hoge</div>
        </div>
      </div>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: 25% 75%;
            max-width: 1480px;
            width: 100%;
            margin: 0 auto;
            gap: 20px;
          }
        `}
      </style>
    </>
  );
};

export default Top;
