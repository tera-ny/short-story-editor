import firebase from "firebase/app";
import "firebase/firestore";

interface TimeStamps {
  createTime: firebase.firestore.Timestamp;
  updateTime: firebase.firestore.Timestamp;
}

export interface Story extends TimeStamps {
  title: string;
  description?: string;
  body: string;
  isPublished: boolean;
  isActive: boolean;
}

export interface User extends TimeStamps {
  name: string;
  icon?: string;
  aboutMe?: string;
}
