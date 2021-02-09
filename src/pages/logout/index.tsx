import { NextPage } from "next";
import Auth from "~/components/auth";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";
import LogoutTemplate from "~/templates/logout";

const Page: NextPage<{}> = () => {
  return (
    <>
      <Header />
      <main>
        <Auth>
          <LogoutTemplate />
        </Auth>
      </main>
      <style jsx>{defaultStyle}</style>
      <style jsx>{`
        main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default Page;
