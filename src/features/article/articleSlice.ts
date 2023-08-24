import { createSlice } from '@reduxjs/toolkit';
import { FieldPath, FieldValue } from 'firebase/firestore';
import {
  uploadArticle,
  assignTeam,
  updateStatus,
  sendComment,
  uploadVersion,
  updateAbstract,
} from './articleAsyncuThunk';
import { ArticleInfoInt, CommentInt, VerUrlsInt } from '../../types';

interface InitialStateInt {
  allArticles: ArticleInfoInt[];
  publishedArticles: ArticleInfoInt[];
  authorArticles: ArticleInfoInt[];
  editorArticles: ArticleInfoInt[];
  reviewerArticles: ArticleInfoInt[];
  isFetchingArticles: boolean;
  isUploadingAritlce: boolean;
  justUploaded: boolean;
  articleError: string;
  articleAppLoading: boolean;
  isFirstEnter: boolean;
  isAssigningTeam: boolean;
  isAssigningTeamFailed: boolean;
  justAssignedTeam: boolean;
  isUpdatingStatus: boolean;
  isUpdatingStatusFailed: boolean;
  justUpdatedStatus: boolean;
  isSendingComment: boolean;
  isUploadingVersion: boolean;
  isVerUploadFailed: boolean;
  justUploadedVer: boolean;
  isUpdatingAbstract: boolean;
  isUpdatingAbstractFailed: boolean;
  justUpdatedAbstract: boolean;
  initialLoading: boolean;
}

const initialState: InitialStateInt = {
  allArticles: [],
  publishedArticles: [],
  authorArticles: [],
  editorArticles: [],
  reviewerArticles: [],
  isFetchingArticles: false,
  isUploadingAritlce: false,
  justUploaded: false,
  articleError: '',
  articleAppLoading: !true,
  isFirstEnter: true,
  isAssigningTeam: false,
  isAssigningTeamFailed: false,
  justAssignedTeam: false,
  isUpdatingStatus: false,
  isUpdatingStatusFailed: false,
  justUpdatedStatus: false,
  isSendingComment: false,
  isUploadingVersion: false,
  isVerUploadFailed: false,
  justUploadedVer: false,
  isUpdatingAbstract: false,
  isUpdatingAbstractFailed: false,
  justUpdatedAbstract: false,
  initialLoading: true,
};

const versionsSetter = (
  articles: ArticleInfoInt[],
  id: string,
  versions: VerUrlsInt[]
): ArticleInfoInt[] => {
  return articles.map((article) =>
    article.id === id
      ? {
          ...article,
          verUrls: versions,
        }
      : article
  );
};

const commentsSetter = (
  articles: ArticleInfoInt[],
  id: string,
  comments: CommentInt[],
  commentSect: string
): ArticleInfoInt[] => {
  return articles.map((article) =>
    article.id === id
      ? {
          ...article,
          comments: { ...article.comments, [`${commentSect}`]: comments },
        }
      : article
  );
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    resetJustUploaded(state, action) {
      state.justUploaded = false;
    },
    resetArticleError(state, action) {
      state.articleError = '';
    },
    setPublishedArticles(state, action) {
      state.publishedArticles = action.payload;
    },
    setAuthorArticles(state, action) {
      state.authorArticles = action.payload;
    },
    setEditorArticles(state, action) {
      state.editorArticles = action.payload;
    },
    setReviewerArticles(state, action) {
      state.reviewerArticles = action.payload;
    },
    setAllArticles(state, action) {
      state.allArticles = action.payload;
    },
    setArticleLoading(state, action) {
      state.articleAppLoading = action.payload;
    },
    resetIsFirstEnter(state, action) {
      state.isFirstEnter = false;
    },
    setAuthorComments(state, action) {
      const { id, newComments, role } = action.payload;
      const modComments = newComments as CommentInt[];

      switch (role) {
        case 'author':
          state.authorArticles = commentsSetter(
            state.authorArticles,
            id,
            modComments,
            'author'
          );
          break;

        case 'editor':
          state.editorArticles = commentsSetter(
            state.editorArticles,
            id,
            modComments,
            'author'
          );
          break;

        default:
          state.allArticles = state.allArticles.map((article) =>
            article.id === id
              ? {
                  ...article,
                  comments: { ...article.comments, author: modComments },
                }
              : article
          );
          return state;
      }
    },
    setReviewersComments(state, action) {
      const { id, newComments, role } = action.payload;
      const modComments = newComments as CommentInt[];

      switch (role) {
        case 'reviewer':
          state.reviewerArticles = commentsSetter(
            state.reviewerArticles,
            id,
            modComments,
            'reviewers'
          );
          break;

        case 'editor':
          state.editorArticles = commentsSetter(
            state.editorArticles,
            id,
            modComments,
            'reviewers'
          );
          break;

        default:
          state.allArticles = commentsSetter(
            state.allArticles,
            id,
            modComments,
            'reviewers'
          );
          return state;
      }
    },
    setEditorsComments(state, action) {
      const { id, newComments, role } = action.payload;
      const modComments = newComments as CommentInt[];

      switch (role) {
        case 'editor':
          state.editorArticles = commentsSetter(
            state.editorArticles,
            id,
            modComments,
            'editors'
          );
          break;

        default:
          state.allArticles = commentsSetter(
            state.allArticles,
            id,
            modComments,
            'editors'
          );
          return state;
      }
    },
    resetIsAssigningTeamFailed(state, action) {
      state.isAssigningTeamFailed = false;
    },
    resetJustAssignedTeam(state, action) {
      state.justAssignedTeam = false;
    },
    resetJustUpdatedStatus(state, action) {
      state.justUpdatedStatus = false;
    },
    resetIsUpdatingStatusFailed(state, action) {
      state.isUpdatingStatusFailed = false;
    },
    resetIsVerUploadFailed(state, action) {
      state.isVerUploadFailed = false;
    },
    resetIsUpdatingAbstractFailed(state, action) {
      state.isUpdatingAbstract = false;
    },
    resetJustUploadeVer(state, action) {
      state.justUploadedVer = false;
    },
    resetJustUpdatedAbstract(state, action) {
      state.justUpdatedAbstract = false;
    },
    setVersions(state, action) {
      const { versions, role, id } = action.payload;

      const modVersions = versions as VerUrlsInt[];

      switch (role) {
        case 'author':
          state.authorArticles = versionsSetter(
            state.authorArticles,
            id,
            modVersions
          );
          break;
        case 'reviewer':
          state.reviewerArticles = versionsSetter(
            state.reviewerArticles,
            id,
            modVersions
          );
          break;
        case 'editor':
          state.editorArticles = versionsSetter(
            state.editorArticles,
            id,
            modVersions
          );
          break;
        default:
          state.allArticles = versionsSetter(
            state.allArticles,
            id,
            modVersions
          );
          return state;
      }
    },
    setInitialLoading(state, action) {
      state.initialLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadArticle.pending, (state) => {
        state.isUploadingAritlce = true;
      })
      .addCase(uploadArticle.fulfilled, (state, action) => {
        state.isUploadingAritlce = false;
        state.justUploaded = true;
      })
      .addCase(uploadArticle.rejected, (state, error) => {
        state.articleError = error.payload as string;
        console.log('error');
      });
    builder
      .addCase(assignTeam.pending, (state) => {
        state.isAssigningTeam = true;
      })
      .addCase(assignTeam.fulfilled, (state, action) => {
        state.justAssignedTeam = true;
        state.isAssigningTeam = false;
      })
      .addCase(assignTeam.rejected, (state, error) => {
        state.isAssigningTeam = false;
        state.isAssigningTeamFailed = true;
        console.log(error);
      });
    builder
      .addCase(updateStatus.pending, (state) => {
        state.isUpdatingStatus = true;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.justUpdatedStatus = true;
        state.isUpdatingStatus = false;
      })
      .addCase(updateStatus.rejected, (state, error) => {
        state.isUpdatingStatus = false;
        state.isUpdatingStatusFailed = true;
        console.log(error);
      });
    builder
      .addCase(sendComment.pending, (state) => {
        state.isSendingComment = true;
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        state.isSendingComment = false;
      })
      .addCase(sendComment.rejected, (state, error) => {
        state.isSendingComment = false;
        console.log(error);
      });
    builder
      .addCase(uploadVersion.pending, (state) => {
        state.isUploadingVersion = true;
      })
      .addCase(uploadVersion.fulfilled, (state, action) => {
        state.isUploadingVersion = false;
        state.justUploadedVer = true;
      })
      .addCase(uploadVersion.rejected, (state, error) => {
        state.isVerUploadFailed = true;
        state.isUploadingVersion = false;
        console.log(error);
      });
    builder
      .addCase(updateAbstract.pending, (state) => {
        state.isUpdatingAbstract = true;
      })
      .addCase(updateAbstract.fulfilled, (state, action) => {
        state.isUpdatingAbstract = false;
        state.justUpdatedAbstract = true;
      })
      .addCase(updateAbstract.rejected, (state, error) => {
        state.isUpdatingAbstract = false;
        state.isUpdatingAbstractFailed = true;
        console.log(error);
      });
  },
});

export default articleSlice.reducer;
