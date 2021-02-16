import { FC, useCallback, useEffect, useMemo, useState } from "react";
import authState from "~/stores/auth";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import firebase, { storyConverter } from "~/modules/firebase";
import Template from "~/templates/edit";
import { Story } from "~/modules/entity";

const storyRef = (uid: string, id: string) =>
  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("stories")
    .doc(id)
    .withConverter(storyConverter);

const Container: FC = () => {
  const [story, setStory] = useState<Story>();
  const uid = useRecoilValue(authState);
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const id = router.query.storyid;
      if (typeof id === "string" && uid) {
        const story = await storyRef(uid, id)
          .withConverter(storyConverter)
          .get();
        if (mounted) {
          setStory(story.data());
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router.query.storyid, uid]);
  const submit = useCallback(
    async (title: string, description: string, body: string) => {
      const id = router.query.storyid;
      if (typeof id === "string" && uid) {
        try {
          setError(undefined);
          setIsSubmitting(true);
          await storyRef(uid, id).set(
            { title, description, body },
            { merge: true }
          );
        } catch {
          setError("更新に失敗しました。再度送信をお願いします");
        }
        setIsSubmitting(false);
      }
    },
    [router.query.storyid, uid]
  );
  return (
    <>
      {story && (
        <Template
          data={story}
          submit={submit}
          error={error}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default Container;
