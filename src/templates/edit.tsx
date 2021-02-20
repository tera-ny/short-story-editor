import { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { currentStoryState } from "~/stores/story";
import authState from "~/stores/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import Editor from "~/components/editor";
import { path } from "~/modules/firebase";

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
  const [story, setStory] = useRecoilState(currentStoryState);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setStory(undefined);
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
    return <Editor id={id} story={story} />;
  } else if (error) {
    return <p>{error}</p>;
  } else {
    return <></>;
  }
};

export default Template;
