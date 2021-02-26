import { NextPage, GetStaticProps } from "next";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";
import Auth from "~/components/auth";
import Template from "~/templates/story/new";

export const getStaticProps: GetStaticProps<{}> = async () => {
  return { props: {} };
};

const Page: NextPage = () => {
  return (
    <>
      <Header />
      <main>
        <Auth shouldLoggedIn>
          <Template />
        </Auth>
      </main>
      <style jsx>{defaultStyle}</style>
    </>
  );
};

export default Page;
