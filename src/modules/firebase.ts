import firebase from "firebase/app";
import "firebase/auth";
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

export default app;
