import { FC, useEffect } from "react";
import { useRecoilState } from "recoil";
import authState from "~/stores/auth";
import firebase from "~/modules/firebase";
import NextError from "next/error";

interface Props {
  shouldLoggedIn?: boolean;
}

const Auth: FC<Props> = ({ children, shouldLoggedIn }) => {
  const [auth, setAuth] = useRecoilState(authState);
  useEffect(() => {
    if (auth.subscribed) return;
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setAuth({ uid: user?.uid ?? null, subscribed: true });
    });
    return () => {
      unsubscribe();
    };
  }, [auth.subscribed]);
  if (shouldLoggedIn) {
    if (!auth.subscribed) {
      return <></>;
    }
    return auth.uid ? <>{children}</> : <NextError statusCode={403} />;
  } else {
    return <>{children}</>;
  }
};

export default Auth;
