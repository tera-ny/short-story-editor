import { FC, useEffect, useState } from "react";
import authState from "~/stores/auth";
import { useRecoilCallback } from "recoil";
import { path } from "~/modules/firebase";
import { format } from "~/modules/date";
import Indicator from "~/components/indicator";
import { Story } from "~/modules/entity";

interface Props {
  id?: string;
  story: Story;
}

const Editor: FC<Props> = ({ id, story }) => {
  const [title, setTitle] = useState(story?.title ?? "");
  const [description, setDescription] = useState(story?.description ?? "");
  const [body, setBody] = useState(story?.body ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(story?.title ?? "");
    setDescription(story?.description ?? "");
    setBody(story?.body ?? "");
  }, [story]);

  const onSubmit = useRecoilCallback(
    ({ snapshot }) => async () => {
      if (isSubmitting) {
        return;
      }
      setIsSubmitting(true);
      const uid = await snapshot.getPromise(authState);
      const ref = path.users.stories.id.ref(uid, id);
      await ref.set({ title, description, body }, { merge: true });
      setIsSubmitting(false);
    },
    [title, description, body, isSubmitting]
  );

  return (
    <>
      <div className={"container"}>
        <div className={"meta"}>
          <h2>タイトル</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <h2>説明文</h2>
          <textarea
            rows={10}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          {story && story.updateTime && (
            <p className={"updateTime"}>
              {"更新 • " +
                format(story.updateTime.toDate(), "YYYY/MM/DD HH:mm:ss")}
            </p>
          )}
        </div>
        <div className={"content"}>
          <div className={"bodyText"}>
            <h2>本文</h2>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
              }}
            />
          </div>
          {isSubmitting && (
            <div className={"indicator"}>
              <Indicator visible={true} height={28} width={28} />
            </div>
          )}
          <button
            disabled={isSubmitting}
            onClick={() => {
              onSubmit();
            }}
          >
            保存
          </button>
        </div>
      </div>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: 25% auto;
            max-width: 1480px;
            width: 100%;
            margin: 0 auto;
            gap: 32px;
            box-sizing: border-box;
            padding: 40px 20px 0;
            height: calc(95vh - 52px);
          }
          .indicator {
            align-self: center;
            grid-column: 2/3;
            display: flex;
            align-items: center;
          }

          .meta > textarea {
            resize: vertical;
            max-height: calc(40vh - 52px);
          }

          .content {
            display: grid;
            gap: 24px;
            grid-template-rows: 1fr auto;
            grid-template-columns: 1fr 32px auto;
          }

          .bodyText {
            grid-column: 1/4;
            display: grid;
            grid-template-rows: auto 1fr;
          }

          .bodyText > textarea {
            resize: none;
          }

          .updateTime {
            font-size: 16px;
            font-weight: 100;
          }

          .error {
            margin: 0;
            color: #e64b4b;
          }

          div,
          textarea,
          input {
            box-sizing: border-box;
          }

          h2 {
            margin: 8px 0;
            font-weight: 500;
            font-size: 16px;
          }

          textarea {
            font-size: 16px;
            font-weight: 300;
            padding: 8px;
            line-height: 150%;
          }

          input {
            font-size: 20px;
            font-weight: 500;
            padding: 4px 8px;
            color: #313131;
          }

          textarea,
          input {
            width: 100%;
            border: none;
            border-color: #dadada;
            border-width: 0.5px;
            border-style: solid;
            border-radius: 8px;
            outline: none;
          }

          button {
            background-color: black;
            color: white;
            outline: none;
            text-decoration: none;
            border: none;
            padding: 8px 48px;
            font-weight: 500;
            font-size: 16px;
            grid-column: 3/4;
            border-radius: 8px;
            user-select: none;
            cursor: pointer;
          }

          button:active {
            background-color: #414141;
          }

          button:disabled {
            background-color: #646464;
            cursor: default;
          }
        `}
      </style>
    </>
  );
};

export default Editor;
