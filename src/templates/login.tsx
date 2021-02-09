import { FC, useCallback, useEffect, useState } from "react";
import authState from "~/stores/auth";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import firebase from "~/modules/firebase";

const Login: FC = () => {
  const uid = useRecoilValue(authState);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useCallback(() => {
    firebase.auth().signInWithEmailAndPassword(email, password);
  }, [email, password]);

  useEffect(() => {
    if (uid) {
      router.push("/");
    }
  }, [uid]);

  if (uid !== null) {
    return <></>;
  }
  return (
    <>
      <div className="container">
        <h2>short-story.space editorにログイン</h2>
        <input
          type="email"
          placeholder="mail@short-story.space"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <div className="tools">
          <a href="/account/reset_password">パスワードをお忘れの方</a>
          <button
            onClick={() => {
              login();
            }}
          >
            ログイン
          </button>
        </div>
      </div>
      <style jsx>
        {`
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
        `}
      </style>
    </>
  );
};

export default Login;
