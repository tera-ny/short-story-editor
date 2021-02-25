import { FC, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import StoryCell from "~/components/storycell";
import authState from "~/stores/auth";
import { path } from "~/modules/firebase";
import NextLink from "next/link";
import { SectionType, storiesSelector } from "~/stores/story";

interface Props {
  type: SectionType;
}

const StoryList: FC<Props> = ({ type }) => {
  const [stories, setStories] = useRecoilState(storiesSelector({ type }));
  const uid = useRecoilValue(authState);
  useEffect(() => {
    if (uid) {
      let mounted = true;
      (async () => {
        const stories = await path.users.stories
          .ref(uid)
          .where("isActive", "==", true)
          .orderBy("updateTime", "desc")
          .get();
        if (mounted) {
          setStories(
            stories.docs.map((storySnapshot) => {
              return { ...storySnapshot.data(), id: storySnapshot.id };
            })
          );
        }
      })();
      return () => {
        mounted = false;
      };
    }
  }, [uid]);
  return (
    <>
      <div className={"container"}>
        <div className={"header"}>
          <span>小説</span>
        </div>
        {stories.map((story, index) => (
          <NextLink key={index} href={`stories/${story.id}/edit`}>
            <a>
              <StoryCell key={index} data={story} />
            </a>
          </NextLink>
        ))}
      </div>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            grid-template-rows: 30px repeat(auto-fill, 120px);
            row-gap: 20px;
            column-gap: 20px;
            box-sizing: border-box;
          }
          .header {
            grid-column: 1 / -1;
            display: grid;
            justify-content: left;
          }
          hr {
            border: none;
            border-left: 0.1px solid #333333;
            height: 22px;
            margin: 0;
          }
          span {
            font-weight: 100;
            font-size: 20px;
            padding: 0 10px;
            user-select: none;
            cursor: default;
          }
          a {
            text-decoration: none;
            color: #212121;
          }
          a:active {
            color: #818181;
            border-color: #818181;
          }
        `}
      </style>
    </>
  );
};

export default StoryList;
