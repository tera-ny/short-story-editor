import { FC } from "react";
import { useRecoilValue } from "recoil";
import authState from "~/stores/auth";
import LoggedInTemplate from "~/templates/top/loggedin";

const Top: FC = () => {
  const uid = useRecoilValue(authState);
  if (uid === undefined) {
    return <></>;
  } else if (uid) {
    return <LoggedInTemplate />;
  } else {
    return <></>;
  }
};

export default Top;
