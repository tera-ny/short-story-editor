import firebase from "firebase/app";
import "firebase/firestore";
import { User, Story } from "~/modules/entity";
import omitBy from "lodash.omitby";
import isUndefined from "lodash.isundefined";

const app =
  firebase.apps.length === 0
    ? firebase.initializeApp({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID,
      })
    : firebase.apps[0];

export const userConverter: firebase.firestore.FirestoreDataConverter<User> = {
  toFirestore(user: Partial<User>): firebase.firestore.DocumentData {
    return omitBy(
      {
        name: user.name,
        icon: user.icon,
        updateTime: firebase.firestore.FieldValue.serverTimestamp,
      },
      isUndefined
    );
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): User {
    const data = snapshot.data(options)!;
    return data as User;
  },
};

export const createStoryConverter: firebase.firestore.FirestoreDataConverter<Story> = {
  toFirestore(
    story: Pick<Story, "title" | "description" | "body">
  ): firebase.firestore.DocumentData {
    return {
      title: story.title,
      body: story.body,
      isPublished: false,
      isActive: true,
      createTime: firebase.firestore.FieldValue.serverTimestamp(),
      updateTime: firebase.firestore.FieldValue.serverTimestamp(),
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Story {
    throw new Error("set only support");
  },
};

export const storyConverter: firebase.firestore.FirestoreDataConverter<Story> = {
  toFirestore(story: Partial<Story>): firebase.firestore.DocumentData {
    return omitBy(
      {
        title: story.title,
        body: story.body,
        isPublished: story.isPublished,
        description: story.description,
        isActive: story.isActive,
        updateTime: firebase.firestore.FieldValue.serverTimestamp(),
      },
      isUndefined
    );
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Story {
    const data = snapshot.data(options)!;
    return data as Story;
  },
};

const usersRef = () =>
  app.firestore().collection("users").withConverter(userConverter);

const userRef = (uid: string) =>
  usersRef().doc(uid).withConverter(userConverter);

const storiesRef = (uid: string) =>
  userRef(uid).collection("stories").withConverter(storyConverter);

const storyRef = (uid: string, id?: string) =>
  storiesRef(uid).doc(id).withConverter(storyConverter);

export const path = {
  users: {
    ref: usersRef,
    id: {
      ref: userRef,
    },
    stories: {
      ref: storiesRef,
      id: {
        ref: storyRef,
      },
    },
  },
};

export default app;
