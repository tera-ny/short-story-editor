import { NextPage, GetStaticProps } from "next";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";
import TopTemplate from "~/templates/top";
import Auth from "~/components/auth";

export const getStaticProps: GetStaticProps<{}> = async () => {
  return { props: {} };
};

const Page: NextPage<{}> = () => {
  return (
    <>
      <Header />
      <main>
        <Auth>
          <TopTemplate />
        </Auth>
      </main>
      <style jsx>{defaultStyle}</style>
      <style jsx>
        {`
          main {
            padding: 40px 20px;
          }
        `}
      </style>
    </>
  );
};

export default Page;
