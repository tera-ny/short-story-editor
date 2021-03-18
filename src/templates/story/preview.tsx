import { useRouter } from "next/router";
import { FC, useMemo, useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { storyState } from "~/stores/story";
import authState from "~/stores/auth";
import { path } from "~/modules/firebase";
import Preview from "~/components/storypreview";

const Template: FC = () => {
  const router = useRouter();
  const uid = useRecoilValue(authState);
  const id = useMemo(() => {
    if (typeof router.query.storyid === "string") {
      return router.query.storyid;
    } else {
      return undefined;
    }
  }, [router.query.storyid]);
  const [story, setStory] = useRecoilState(storyState({ id }));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id) {
      return;
    }
    const unsubscribe = path.users.stories.id.ref(uid, id).onSnapshot(
      (snapshot) => {
        if (snapshot.exists) {
          setStory(snapshot.data());
        }
      },
      (err) => {
        switch (err.code) {
          case "permission-denied":
            setError("作品が存在しません");
            break;
          default:
            setError("予期せぬエラーが発生しました");
            break;
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, [uid, id]);
  if (story) {
    return (
      <>
        <div>
          <Preview story={story} />
        </div>
        <style jsx>
          {`
            div {
              max-width: 1480px;
              width: 100%;
              margin: 0 auto;
            }
          `}
        </style>
      </>
    );
  } else if (error) {
    return <p>{error}</p>;
  } else {
    return <></>;
  }
};

export default Template;
