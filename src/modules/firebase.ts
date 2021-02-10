import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { User } from "~/modules/entity";

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
    return {
      name: user.name,
      icon: user.icon,
      updateTime: firebase.firestore.FieldValue.serverTimestamp,
    };
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): User {
    const data = snapshot.data(options)!;
    return data as User;
  },
};

export default app;
