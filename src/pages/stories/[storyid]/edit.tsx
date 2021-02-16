import { NextPage, GetStaticProps, GetStaticPaths } from "next";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";
import Auth from "~/components/auth";
import Container from "~/container/edit";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<{}> = async () => {
  return { props: {} };
};

const Page: NextPage<{}> = () => {
  return (
    <>
      <Header />
      <main>
        <Auth shouldLoggedIn>
          <Container />
        </Auth>
      </main>
      <style jsx>{defaultStyle}</style>
    </>
  );
};

export default Page;
