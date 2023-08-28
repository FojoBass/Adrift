import { ref, uploadBytesResumable } from 'firebase/storage';
import {
  AssingTeamPayloadInt,
  CommentsInt,
  DataInt,
  ModVerDataInt,
  SendCommentPayloadInt,
  TargetEnum,
  UserInfoInt,
  VerDataInt,
} from '../types';
import { db, auth, storage } from './firbase_config';
import {
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import {
  setDoc,
  doc,
  collection,
  query,
  getDocs,
  where,
  orderBy,
  updateDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import ShortUniqueId from 'short-unique-id';

export const usersColRef = collection(db, 'users');
export const articlesColRef = collection(db, 'articles');

const uid = new ShortUniqueId({ length: 7 });

export class EduJournServices {
  // *Authentication Methods
  EPSignUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  emailVer() {
    if (auth.currentUser) return sendEmailVerification(auth.currentUser);
  }

  logOut() {
    sessionStorage.removeItem('userRole');
    return signOut(auth);
  }

  EPSignIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  updateUserPassword(password: string) {
    return updatePassword(auth.currentUser!, password);
  }

  // *Storage Methods
  uploadImg(userId: string, imgFile: File) {
    const imgRef = ref(storage, `avis/${userId}}`);
    return uploadBytesResumable(imgRef, imgFile);
  }

  uploadFile(userId: string, file: File, isMain = false, title = '') {
    const fileRef = ref(
      storage,
      `articles/${userId}/${isMain ? 'main' : 'supplementary'}/${
        title ? title : uid()
      }`
    );
    return uploadBytesResumable(fileRef, file);
  }

  // *Firestore Methods
  // * User
  setUserInfo(data: UserInfoInt) {
    const modData = { ...data, imgFile: '' };

    const docRef = doc(db, `users/${data.id}`);
    return setDoc(docRef, modData);
  }

  getLoggedInUserInfo(email: string, role: string) {
    const q = query(
      usersColRef,
      where('email', '==', email),
      where('role', '==', role)
    );
    return getDocs(q);
  }

  isUserRegistered(email: string) {
    const q = query(usersColRef, where('email', '==', email));
    return getDocs(q);
  }

  updateUserInfo(data: {
    name: string;
    title: string;
    affiliation: string;
    dept: string;
    id: string;
  }) {
    const { name, title, affiliation, dept, id } = data;
    const docRef = doc(db, `users/${id}`);
    return updateDoc(docRef, { name, title, affiliation, dept });
  }

  // * Article
  setArticleInfoBasic(data: DataInt) {
    const docRef = doc(db, `articles/${data.id}`);
    return setDoc(docRef, data);
  }

  setArticleInfoVer(data: ModVerDataInt, id: string) {
    const docRef = doc(db, `articles/${id}/versions/${uid()}`);
    return setDoc(docRef, data);
  }

  setArticleInfoComments(data: CommentsInt, id: string) {
    const docRef = doc(db, `articles/${id}/comments/${uid()}`);
    return setDoc(docRef, data);
  }

  assignTeam(data: AssingTeamPayloadInt) {
    const docRef = doc(db, `articles/${data.articleId}`);
    return updateDoc(
      docRef,
      data.type === 'reviewer'
        ? { assReviewers: data.opts }
        : data.type === 'editor'
        ? { assEditors: data.opts }
        : {}
    );
  }

  updateStatus(data: { status: string; articleId: string }) {
    const docRef = doc(db, `articles/${data.articleId}`);
    return updateDoc(docRef, { status: data.status });
  }

  updateAbsract(data: { abstract: string; articleId: string }) {
    const docRef = doc(db, `articles/${data.articleId}`);
    return updateDoc(docRef, { abstract: data.abstract });
  }

  setComment(data: SendCommentPayloadInt) {
    const docRef = doc(
      db,
      `articles/${data.articleId}/comments/${data.articleId}/${
        data.target
      }/${uid()}`
    );

    return setDoc(docRef, data.data);
  }

  getComments(articleId: string, target: TargetEnum) {
    const collectionRef = collection(
      db,
      `articles/${articleId}/comments/${articleId}/${target}`
    );
    return getDocs(collectionRef);
  }

  getVersions(articleId: string) {
    const collectionRef = collection(db, `articles/${articleId}/versions`);
    return getDocs(collectionRef);
  }

  getVolumeCount() {
    const docRef = doc(db, 'volume_count/vol');
    return getDoc(docRef);
  }

  setVolumeCount(count: number) {
    const docRef = doc(db, 'volume_count/vol');
    return updateDoc(docRef, { count });
  }

  publishArticle(articleId: string, volCount: number) {
    const docRef = doc(db, `articles/${articleId}`);
    return updateDoc(docRef, {
      status: 'published',
      vol: volCount,
      publishedAt: serverTimestamp(),
    });
  }
}
