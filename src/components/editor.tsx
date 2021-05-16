import { FC, useCallback, useEffect, useMemo, useState } from "react";
import authState from "~/stores/auth";
import { useRecoilCallback } from "recoil";
import { path, createStoryConverter } from "~/modules/firebase";
import { format } from "~/modules/date";
import Indicator from "~/components/indicator";
import { Story } from "~/modules/entity";
import NextImage from "next/image";
import firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

type Props =
  | ({
      type: "edit";
      id?: string;
    } & Story)
  | {
      type: "new";
      destination: string;
    };

const Editor: FC<Props> = (props) => {
  const [title, setTitle] = useState(props.type === "edit" ? props.title : "");
  const [description, setDescription] = useState(
    props.type === "edit" ? props.description : ""
  );
  const [body, setBody] = useState(props.type === "edit" ? props.body : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisplayPopup, setIsDisplayPopup] = useState(false);
  const router = useRouter();

  const canSubmit = useMemo(() => title.length > 0, [title]);

  const hasDiff = useMemo(
    () =>
      props.type === "new" ||
      (props.type === "edit" &&
        (props.title !== title ||
          props.description !== description ||
          props.body !== body)),
    [props, title, description, body]
  );

  useEffect(() => {
    if (!hasDiff) {
      return;
    }
    const handleUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [hasDiff]);

  const onSubmit = useRecoilCallback(
    ({ snapshot }) => async () => {
      if (isSubmitting || !canSubmit || (props.type === "edit" && !hasDiff)) {
        return;
      }
      setIsSubmitting(true);
      const auth = await snapshot.getPromise(authState);
      let ref: firebase.firestore.DocumentReference<Story>;
      if (props.type === "edit") {
        ref = path.users.stories.id.ref(auth.uid, props.id);
      } else {
        ref = path.users.stories
          .ref(auth.uid)
          .withConverter(createStoryConverter)
          .doc();
      }
      await ref.set({ title, description, body }, { merge: true });
      if (props.type === "new") {
        router.replace(`/stories/${ref.id}/edit`);
      }
      setIsSubmitting(false);
    },
    [title, description, body, isSubmitting, props]
  );

  const handleSave = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        onSubmit();
        e.preventDefault();
        return false;
      }
    },
    [title, description, body, isSubmitting, props]
  );

  useEffect(() => {
    if (window) {
      window.addEventListener("keydown", handleSave);
      return () => {
        window.removeEventListener("keydown", handleSave);
      };
    }
  }, [title, description, body, isSubmitting, , props]);

  return (
    <>
      <div
        className={"container"}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            onSubmit();
            e.preventDefault();
            return false;
          }
        }}
      >
        <div className={"linkContainer"}>
          <Link
            href={`/stories/${
              props.type === "edit" ? props.id : "new"
            }/preview`}
          >
            <a className={"previewLink"}>プレビュー👀</a>
          </Link>
        </div>
        <div>
          <input
            type="text"
            placeholder={"タイトル"}
            className="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <textarea
            placeholder={"メモ"}
            rows={10}
            value={description}
            className="memo"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          {props.type === "edit" && props.updateTime && (
            <p className={"updateTime"}>
              {"更新 • " +
                format(props.updateTime.toDate(), "YYYY/MM/DD HH:mm:ss")}
            </p>
          )}
        </div>
        <div className={"content"}>
          <textarea
            className={"bodyText"}
            value={body}
            placeholder={"本文"}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          {isSubmitting && (
            <div className={"indicator"}>
              <Indicator visible={true} height={28} width={28} />
            </div>
          )}
          <div className={"helpContainer"}>
            {isDisplayPopup && (
              <div className={"helpPopup"}>
                <p>
                  Ctrl + S もしくは ⌘ + S で作品の保存をすることができます。
                </p>
              </div>
            )}
            <button
              className={"helpIcon"}
              onBlur={() => {
                setIsDisplayPopup(false);
              }}
              onClick={() => {
                setIsDisplayPopup(!isDisplayPopup);
              }}
            >
              <NextImage
                src="/question_icon_dark_gray.png"
                height={200}
                width={200}
              />
            </button>
          </div>
          <button
            disabled={isSubmitting || !hasDiff || !canSubmit}
            onClick={() => {
              onSubmit();
            }}
          >
            {hasDiff
              ? props.type === "edit"
                ? "保存"
                : "新規作成"
              : "保存完了"}
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
            padding: 40px 20px 80px;
            height: calc(100vh - 80px);
            position: relative;
          }

          .linkContainer {
            position: absolute;
            right: 0;
            padding-right: 20px;
          }

          .previewLink {
            color: #272423;
            text-decoration: none;
            background-color: #fbfcfe;
          }

          .content {
            display: grid;
            gap: 24px;
            grid-template-rows: 1fr auto;
            grid-template-columns: 1fr 32px 28px auto;
          }

          .title {
            margin-bottom: 20px;
            font-weight: 500;
            font-size: 18px;
          }

          .memo {
            resize: vertical;
            max-height: calc(40vh - 52px);
            font-size: 16px;
            font-weight: 100;
          }

          .bodyText {
            resize: none;
            font-size: 16px;
            font-weight: normal;
            font-weight: 300;
            grid-column: 1/5;
          }

          .updateTime {
            font-size: 16px;
            font-weight: 100;
          }

          .error {
            margin: 0;
            color: #e64b4b;
          }

          .indicator {
            align-self: center;
            grid-column: 2/3;
            display: flex;
            align-items: center;
          }

          .helpContainer {
            grid-column: 3/4;
            align-self: center;
            justify-self: center;
            position: relative;
          }

          .helpPopup {
            position: absolute;
            bottom: calc(100% + 20px);
            left: -25%;
            background-color: white;
            z-index: 999;
            border: 1px solid #3c3c3c;
            max-height: 80px;
            width: 200px;
            padding: 5px;
            border-radius: 4px;
          }

          .helpPopup::before {
            content: "";
            position: absolute;
            top: 100%;
            left: 12px;
            border: 8px solid transparent;
            border-top: 8px solid black;
          }

          .helpPopup::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 13px;
            border: 7px solid transparent;
            border-top: 7px solid white;
          }

          .helpPopup > p {
            margin: 0;
            font-size: 14px;
            font-weight: 300;
            color: #3c3c3c;
          }

          .helpIcon {
            display: flex;
            width: 28px;
            height: 28px;
            padding: 2px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            outline: none;
            border: none;
            background-color: transparent;
          }

          .helpIcon:hover {
            padding: 1px;
          }

          .helpIcon:active {
            background-color: transparent;
            padding: 2px;
          }

          div,
          textarea,
          input {
            box-sizing: border-box;
          }

          h2 {
            margin: 0;
            font-weight: 500;
            font-size: 16px;
          }

          textarea {
            font-family: inherit;
            padding: 8px;
            line-height: 150%;
          }

          input {
            font-family: inherit;
            padding: 4px 8px;
          }

          textarea,
          input {
            width: 100%;
            border: none;
            border-radius: 4px;
            outline: none;
            background-color: #fbfcfe;
            color: #272423;
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
            grid-column: 4/5;
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
