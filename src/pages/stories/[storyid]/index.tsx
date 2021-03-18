import { NextPage } from "next";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";
import Auth from "~/components/auth";
import Template from "~/templates/story/preview";

const Index: NextPage = () => {
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

export default Index;
