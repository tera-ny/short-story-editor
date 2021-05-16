import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";
import Auth from "~/components/auth";
import Template from "~/templates/story/edit";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<{}> = async () => {
  return { props: {} };
};

const Page: NextPage<{}> = () => {
  return (
    <>
      <Auth shouldLoggedIn>
        <Header />
        <main>
          <Template />
        </main>
      </Auth>
      <style jsx>{defaultStyle}</style>
    </>
  );
};

export default Page;
