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
      <Auth shouldLoggedIn>
        <Header />
        <main>
          <TopTemplate />
        </main>
        <style jsx>{defaultStyle}</style>
      </Auth>
    </>
  );
};

export default Page;
