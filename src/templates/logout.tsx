import { FC, useEffect } from "react";
import authState from "~/stores/auth";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import firebase from "~/modules/firebase";
import "firebase/auth";

const Logout: FC = () => {
  const auth = useRecoilValue(authState);
  const router = useRouter();
  useEffect(() => {
    if (!auth.uid && auth.subscribed) {
      router.push("/login");
    } else {
      firebase.auth().signOut();
    }
  }, [auth]);
  return <></>;
};

export default Logout;
