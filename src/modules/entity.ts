import firebase from "firebase/app";
import "firebase/firestore";

interface TimeStamps {
  createTime?: firebase.firestore.Timestamp;
  updateTime?: firebase.firestore.Timestamp;
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

export interface PlotContent {
  body: string;
}

export interface PlotContentWithNodes extends PlotContent {
  nodes?: PlotContent[];
}

export interface PlotSection {
  title: string;
  templateTitle: string;
  contents: PlotContentWithNodes[];
}

export interface Plot extends TimeStamps {
  title: string;
  memo?: string;
  sections: PlotSection[];
}
