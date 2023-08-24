import { UserCredential } from 'firebase/auth';
import { FieldPath, FieldValue } from 'firebase/firestore';

export interface UserInfoInt {
  name: string;
  id: string;
  title: string;
  email: string;
  dept: string;
  affiliation: string;
  role: string;
  imgUrl?: string;
  imgFile?: File | null;
}

export interface DataInt {
  id: any;
  author: string;
  affiliation: string;
  abstract: string;
  category: string;
  title: string;
  status: StatusEnum;
  createdAt: FieldPath;
  publishedAt: FieldPath | '';
  userId: string;
  assReviewers: never[];
  assEditors: never[];
  email: string;
}

export interface VerDataInt {
  mainUrl: string;
  subUrls: string[];
  timestamp: string;
}

export interface ModVerDataInt {
  mainUrl: string;
  subUrls: string[];
  timestamp: FieldValue;
}

export interface AssingTeamPayloadInt {
  opts: string[];
  type: string;
  articleId: string;
}

export interface SendCommentPayloadInt {
  data: SendCommentInt;
  articleId: string;
  target: TargetEnum;
}

export enum TargetEnum {
  auth = 'author',
  rev = 'reviewers',
  edi = 'editors',
}

export interface CommentInt {
  senderId: string;
  timestamp: string;
  message: string;
  readers: string[];
  name: string;
}

export interface SendCommentInt {
  senderId: string;
  timestamp: FieldValue;
  message: string;
  readers: string[];
  name: string;
}

export interface CommentsInt {
  reviewers: CommentInt[];
  author: CommentInt[];
  editors: CommentInt[];
}

export interface VerUrlsInt {
  mainUrl: string;
  subUrls: string[];
  timestamp: string;
}

export interface ArticleInfoInt {
  id: string;
  author: string;
  affiliation: string;
  title: string;
  abstract: string;
  status: StatusEnum;
  category: string;
  comments: CommentsInt;
  createdAt: FieldPath;
  userID: string;
  publishedAt: FieldPath | '';
  verUrls: VerUrlsInt[];
  assReviewers: string[];
  assEditors: string[];
  email: string;
}

export interface FormDataInt {
  id: any;
  author: string;
  affiliation: string;
  abstract: string;
  category: string;
  title: string;
  userId: string;
  mainFile: '' | File;
  subFiles: [] | FileList | '';
  email: string;
}

export enum PageSectEnum {
  all = 'all',
  rev = 'rev',
  sub = 'sub',
}

export enum StatusEnum {
  sub = 'submitted',
  rev = 'reviewing',
  rej = 'rejected',
  acc = 'accepted',
  pub = 'published',
}

export enum AssignTypeEnum {
  rev = 'reviewer',
  edi = 'editor',
}

export enum MailEnum {
  appArt = 'approve article',
  rejArt = 'reject article',
}