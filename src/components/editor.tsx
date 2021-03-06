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
      const uid = await snapshot.getPromise(authState);
      let ref: firebase.firestore.DocumentReference<Story>;
      if (props.type === "edit") {
        ref = path.users.stories.id.ref(uid, props.id);
      } else {
        ref = path.users.stories
          .ref(uid)
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
          {props.type === "edit" && props.updateTime && (
            <p className={"updateTime"}>
              {"更新 • " +
                format(props.updateTime.toDate(), "YYYY/MM/DD HH:mm:ss")}
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
          <div className={"helpContainer"}>
            {isDisplayPopup && (
              <div className={"helpPopup"}>
                <p>
                  Ctrl + s もしくは Command + s
                  で作品の保存をすることができます。
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
            grid-template-columns: 1fr 32px 28px auto;
          }

          .bodyText {
            grid-column: 1/5;
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
            border-radius: 8px;
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
