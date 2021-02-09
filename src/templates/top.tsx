import { FC } from "react";
import { useRecoilValue } from "recoil";
import authState from "~/stores/auth";
import "firebase/auth";

const Top: FC = () => {
  const uid = useRecoilValue(authState);
  console.log(uid);
  return (
    <>
      <p>
        {uid}
        {uid === undefined && "undefined"}
        {uid === null && "null"}
      </p>
    </>
  );
};

export default Top;
