import { ArticleInfoInt } from './../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EduJournServices } from '../../services/EduJournServices';
import { uploadFile } from '../../helpers/firebaseFunctions';
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import {
  AssingTeamPayloadInt,
  DataInt,
  FormDataInt,
  ModVerDataInt,
  SendCommentPayloadInt,
  StatusEnum,
} from '../../types';
import { articleSlice } from './articleSlice';
import { RootState } from '../../app/store';
import { db } from '../../services/firbase_config';

const eduJournServices = new EduJournServices();

// *Upload Article
export const uploadArticle = createAsyncThunk<void, FormDataInt>(
  'article/uploadArticle',
  async (payload, thunkApi) => {
    const { id } = payload;
    let subUrls: string[] = [];
    try {
      if (payload.subFiles.length && typeof payload.subFiles !== 'string') {
        [...payload.subFiles].forEach(async (file) => {
          const url = await uploadFile(file, id, false, '', subUrls);
          // subUrls.push(url);
        });
      }

      //* upload main file
      const mainUrl = payload.mainFile
        ? await uploadFile(payload.mainFile, id, true, 'main')
        : '';

      // * upload article info
      const data: DataInt = {
        id,
        author: payload.author,
        affiliation: payload.affiliation,
        abstract: payload.abstract,
        category: payload.category,
        title: payload.title,
        status: StatusEnum.sub,
        createdAt: serverTimestamp(),
        userId: payload.userId,
        publishedAt: '',
        assReviewers: [],
        assEditors: [],
        email: payload.email,
        vol: 0,
      };

      const verUrlData: ModVerDataInt = {
        mainUrl,
        subUrls,
        timestamp: serverTimestamp(),
      };

      await eduJournServices.setArticleInfoBasic(data);
      await eduJournServices.setArticleInfoVer(verUrlData, id);
    } catch (error) {
      thunkApi.rejectWithValue(`Article upload ${error}`);
    }
  }
);

// *Assign Team
export const assignTeam = createAsyncThunk<void, AssingTeamPayloadInt>(
  'article/assignTeam',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.assignTeam(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(`Team assign ${error}`);
    }
  }
);

// * Update Status
export const updateStatus = createAsyncThunk<
  void,
  { status: string; articleId: string }
>('article/updateStatus', async (payload, thunkApi) => {
  try {
    await eduJournServices.updateStatus(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(`Status update ${error}`);
  }
});

// *Send Comments
export const sendComment = createAsyncThunk<void, SendCommentPayloadInt>(
  'article/sendComment',
  async (payload, thunkApi) => {
    try {
      await eduJournServices.setComment(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(`Comment sending ${error}`);
    }
  }
);

// *Upload New Version
export const uploadVersion = createAsyncThunk<
  void,
  { mainFile: '' | File; subFiles: [] | FileList | ''; id: string }
>('article/uploadVer', async (payload, thunkApi) => {
  const { id } = payload;
  let subUrls: string[] = [];

  try {
    if (payload.subFiles.length && typeof payload.subFiles !== 'string') {
      [...payload.subFiles].forEach(async (file) => {
        const url = await uploadFile(file, id, false, '', subUrls);
        // subUrls.push(url);
      });
    }

    //* upload main file
    const mainUrl = payload.mainFile
      ? await uploadFile(payload.mainFile, id, true, 'main')
      : '';

    const verUrlData: ModVerDataInt = {
      mainUrl,
      subUrls,
      timestamp: serverTimestamp(),
    };

    await eduJournServices.setArticleInfoVer(verUrlData, id);
  } catch (error) {
    return thunkApi.rejectWithValue(`Version uploading ${error}`);
  }
});

// * Update Abstract
export const updateAbstract = createAsyncThunk<
  void,
  { abstract: string; articleId: string }
>('article/updateAbstract', async (payload, thunkApi) => {
  try {
    await eduJournServices.updateAbsract(payload);
  } catch (error) {
    thunkApi.rejectWithValue(`Updating Abstrat ${error}`);
  }
});

// * Get Volume Count
export const getVolumeCount = createAsyncThunk<void, void>(
  'article/getVolumeCount',
  async (payload, thunkApi) => {
    const { setVolCount } = articleSlice.actions;
    try {
      const q = query(collection(db, 'volume_count'));

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const itemData = doc.data();

          console.log(itemData.count);
          const count: Number = itemData.count as Number;

          thunkApi.dispatch(setVolCount(count));
        });
      });
    } catch (error) {
      thunkApi.rejectWithValue(`Volume count ${error}`);
    }
  }
);

// * Publish Article
export const publishArticle = createAsyncThunk<void, ArticleInfoInt>(
  'article/publishArticle',
  async (payload, thunkApi) => {
    try {
      const newVolCount =
        (thunkApi.getState() as RootState).article.volCount + 1;

      await eduJournServices.setVolumeCount(newVolCount);

      await eduJournServices.publishArticle(payload.id, newVolCount);
    } catch (error) {
      thunkApi.rejectWithValue(`Pulishing ${error}`);
    }
  }
);
