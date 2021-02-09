import { FC, useEffect } from "react";
import authState from "~/stores/auth";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import firebase from "~/modules/firebase";

const Logout: FC = () => {
  const uid = useRecoilValue(authState);
  const router = useRouter();
  useEffect(() => {
    if (uid === null) {
      router.push("/");
    } else if (uid) {
      firebase.auth().signOut();
    }
  }, [uid]);
  return <></>;
};

export default Logout;
