import { FC, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import authState from "~/stores/auth";
import firebase from "~/modules/firebase";

const Auth: FC = ({ children }) => {
  const setAuth = useSetRecoilState(authState);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setAuth(user?.uid ?? null);
    });
    const cleanup = () => {
      unsubscribe();
    };
    return cleanup;
  });
  return <>{children}</>;
};

export default Auth;
