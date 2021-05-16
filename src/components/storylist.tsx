import { FC, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import StoryCell from "~/components/storycell";
import authState from "~/stores/auth";
import { path } from "~/modules/firebase";
import NextLink from "next/link";
import { SectionType, storiesSelector } from "~/stores/story";
import Link from "next/link";

interface Props {
  type: SectionType;
}

const StoryList: FC<Props> = ({ type }) => {
  const [stories, setStories] = useRecoilState(storiesSelector({ type }));
  const auth = useRecoilValue(authState);
  useEffect(() => {
    if (auth.uid) {
      let mounted = true;
      (async () => {
        const stories = await path.users.stories
          .ref(auth.uid)
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
  }, [auth.uid]);
  return (
    <>
      <div className={"container"}>
        <div className={"head"}>
          <span>小説</span>
          <Link href="/stories/new" passHref>
            <a>
              <span>執筆</span>
            </a>
          </Link>
        </div>
        <div className={"contents"}>
          <div className={"contentsHeader"}>
            <p>タイトル</p>
            <p>公開状態</p>
            <p>最終更新日</p>
          </div>
          {stories.map((story, index) => (
            <NextLink key={index} href={`stories/${story.id}/edit`}>
              <a>
                <StoryCell key={index} data={story} />
              </a>
            </NextLink>
          ))}
        </div>
      </div>
      <style jsx>
        {`
          p {
            margin: 0;
            user-select: none;
            font-size: 14px;
            font-weight: 300;
            color: #686868;
          }
          span {
            font-weight: 100;
            font-size: 20px;
            padding: 0 10px;
            user-select: none;
            cursor: default;
          }
          span {
            color: #868686;
            font-size: 20px;
          }
          a > span:hover {
            color: #3c3c3c;
            cursor: pointer;
          }
          a {
            text-decoration: none;
            color: #212121;
          }
          a:active {
            color: #818181;
            border-color: #818181;
          }
          .container {
            box-sizing: border-box;
          }
          .head {
            padding-bottom: 24px;
          }
          .contentsHeader {
            display: grid;
            grid-template-columns: 1fr 120px 70px;
            align-items: center;
            background-color: #fafafa;
            border: 1px solid #d3d3d3;
            border-radius: 4px;
            padding: 8px 12px;
          }
        `}
      </style>
    </>
  );
};

export default StoryList;
