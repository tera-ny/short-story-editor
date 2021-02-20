import { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { currentStoryState, currentStoryIDState } from "~/stores/story";
import authState from "~/stores/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import Editor from "~/components/editor";
import { path } from "~/modules/firebase";

const Template: FC = () => {
  const router = useRouter();
  const uid = useRecoilValue(authState);
  const [id, setID] = useRecoilState(currentStoryIDState);
  const [story, setStory] = useRecoilState(currentStoryState);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setStory(undefined);
  }, []);

  useEffect(() => {
    if (
      router.query.storyid &&
      typeof router.query.storyid === "string" &&
      id !== router.query.storyid
    ) {
      setID(router.query.storyid);
    }
  }, [id, router.query.storyid]);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const ref = path.users.stories.id.ref(uid, id);
        const snapshot = await ref.get();
        if (mounted) {
          setStory(snapshot.data());
        }
      } catch (e) {
        if (mounted) {
          setError(e);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, uid]);

  if (story) {
    return <Editor story={story} />;
  } else if (error) {
    return <p>作品を取得することができませんでした</p>;
  } else {
    return <></>;
  }
};

export default Template;
