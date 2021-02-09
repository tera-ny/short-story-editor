import { NextPage } from "next";
import Header from "~/components/header";
import defaultStyle from "~/styles/page/default";

const Page: NextPage<{}> = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <h2>short-story.space editorにログイン</h2>
          <input type="email" placeholder="mail@short-story.space" />
          <input type="password" placeholder="password" />
          <div className="tools">
            <a href="/account/reset_password">パスワードをお忘れの方</a>
            <button>ログイン</button>
          </div>
        </div>
      </main>
      <style jsx>{defaultStyle}</style>
      <style jsx>{`
        main {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .container {
          display: grid;
          flex-direction: column;
          max-width: 600px;
          align-items: center;
          padding: 24px;
          margin-top: 120px;
          gap: 20px;
        }
        .tools {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding-top: 12px;
        }
        h2 {
          font-size: 28px;
          padding: 0;
          margin: 0;
          padding-bottom: 20px;
          text-align: center;
        }
        input {
          border: none;
          font-size: 18px;
          padding: 8px;
          outline: none;
        }
        .container > * {
          grid-column: 1/2;
        }
        button {
          border: none;
          color: white;
          background-color: black;
          padding: 8px 18px;
          font-size: 18px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
        }
        button:active {
          background-color: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </>
  );
};

export default Page;
