import { NextPage } from "next";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";
import Auth from "~/components/auth";

const Index: NextPage = () => {
  return (
    <>
      <Header />
      <main>
        <Auth shouldLoggedIn></Auth>
      </main>
      <style jsx>{defaultStyle}</style>
    </>
  );
};

export default Index;
