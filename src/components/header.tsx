import { FC } from "react";
import NextLink from "next/link";
import NextImage from "next/image";

const Header: FC = () => (
  <>
    <header>
      <div className={"container"}>
        <div className={"wrapper"}>
          <NextLink href={"/"}>
            <a draggable="false">
              <NextImage
                draggable="false"
                src={"/logo.png"}
                width={1369}
                height={150}
              />
            </a>
          </NextLink>
        </div>
      </div>
      <hr />
    </header>
    <style jsx>
      {`
        header {
          height: 80px;
        }
        hr {
          margin: 0;
          border: none;
        }
        .container {
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .wrapper {
          max-width: 250px;
          padding-left: 24px;
          padding-top: 10px;
        }
      `}
    </style>
  </>
);

export default Header;
