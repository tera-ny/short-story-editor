import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import authState from "~/stores/auth";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import firebase from "~/modules/firebase";
import "firebase/auth";

const useInput = (initialValue: string) => {
  const [value, set] = useState(initialValue);
  return {
    value,
    onChange: (e: ChangeEvent<HTMLInputElement>) => set(e.target.value),
  };
};
const Login: FC = () => {
  const auth = useRecoilValue(authState);
  const router = useRouter();

  const email = useInput("");
  const password = useInput("");
  const [error, setError] = useState("");

  const login = useCallback(async () => {
    try {
      setError("");
      await firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      if (error.code && typeof error.code === "string") {
        setError("メールアドレスもしくはパスワードが異なります。");
      }
    }
  }, [email.value, password.value]);

  useEffect(() => {
    if (auth.uid) {
      router.push("/");
    }
  }, [auth.uid]);
  if (auth.uid !== null) {
    return <></>;
  }
  return (
    <>
      <div className="container">
        <h2>short-story.space editorにログイン</h2>
        <div>
          <p>{error}</p>
        </div>
        <input
          type="email"
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="username"
          placeholder="mail@short-story.space"
          {...email}
        />
        <input type="password" placeholder="password" {...password} />
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
          input:focus {
            border: 1px solid black;
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
          p {
            color: red;
          }
        `}
      </style>
    </>
  );
};

export default Login;
