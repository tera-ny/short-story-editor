import { FC, useEffect } from "react";
import authState from "~/stores/auth";
import userState from "~/stores/user";
import { useRecoilValue, useRecoilState } from "recoil";
import firebase, { userConverter } from "~/modules/firebase";
import NextImage from "next/image";
import { format } from "~/modules/date";

const Profile: FC = () => {
  const uid = useRecoilValue(authState);
  const [user, setUser] = useRecoilState(userState);
  useEffect(() => {
    if (user?.uid === uid) {
      return;
    }
    let mounted = true;
    (async () => {
      const userSnapshot = await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .withConverter(userConverter)
        .get();
      if (mounted) {
        setUser({ uid, data: userSnapshot.data() });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [uid, user]);
  if (!user) {
    return <></>;
  }
  return (
    <>
      {user.data.icon && (
        <div className={"image"}>
          <NextImage src={user.data.icon} width={500} height={500} />
        </div>
      )}
      <h2 className={"name"}>{user.data.name}</h2>
      <p className={"aboutMe"}>{user.data.aboutMe}</p>
      <p className={"startAt"}>
        {format(user.data.createTime.toDate(), "YYYY/MM/DD")}
        から利用しています
      </p>
      <style jsx>
        {`
          h2,
          p {
            margin: 0;
          }
          .image {
            width: 120px;
            height: auto;
            display: flex;
            border-radius: 50%;
            overflow: hidden;
          }
          .name {
            font-weight: 500;
            color: #212121;
            padding-top: 12px;
            font-size: 20px;
          }
          .aboutMe {
            padding-top: 12px;
            font-weight: 300;
            color: #313131;
            font-size: 16px;
          }
          .startAt {
            padding-top: 16px;
            font-weight: 100;
            font-size: 12px;
          }
        `}
      </style>
    </>
  );
};

export default Profile;
