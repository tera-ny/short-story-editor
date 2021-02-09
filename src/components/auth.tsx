import { FC, useEffect } from "react";
import { useRecoilState } from "recoil";
import authState from "~/stores/auth";
import firebase from "~/modules/firebase";

const Auth: FC = ({ children }) => {
  const [uid, setAuth] = useRecoilState(authState);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setAuth(user?.uid ?? null);
    });
    const cleanup = () => {
      unsubscribe();
    };
    return cleanup;
  });
  return <>{uid && children}</>;
};

export default Auth;
