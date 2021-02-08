import { NextPage } from "next";
import Header from "~/components/header";

const Page: NextPage<{}> = () => {
  return (
    <>
      <Header />
      <main>hello</main>
      <style jsx>{`
        main {
          min-height: calc(100vh - 52px);
        }
      `}</style>
    </>
  );
};

export default Page;
