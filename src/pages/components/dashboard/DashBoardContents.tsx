import React, { useEffect, useState } from 'react';
import { articleSlice } from '../../../features/article/articleSlice';
import { useGlobalContext } from '../../../context';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../../../services/firbase_config';
import { v4 } from 'uuid';
import {
  ArticleInfoInt,
  CommentInt,
  MailEnum,
  StatusEnum,
  VerUrlsInt,
} from '../../../types';
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';
import ShortUniqueId from 'short-unique-id';
import { toast } from 'react-toastify';
import { updateStatus } from '../../../features/article/articleAsyncuThunk';

interface DashBoardContentsInt {
  article: ArticleInfoInt;
}

enum RoleClassEnum {
  auth = 'author_opt',
  rev = 'rev_opt',
  edi = 'editor_opt',
  adm = 'admin_opt',
}

const DashBoardContents: React.FC<DashBoardContentsInt> = ({ article }) => {
  const uid = new ShortUniqueId({ length: 7 });

  const {
    setCommentArticleId,
    setStatusArticleId,
    setVersionArticleId,
    setReviewersArticleId,
    setEditorsArticleId,
    setSendMail,
    setIsReload,
  } = useGlobalContext();
  const { isLoggedIn, userDetails } = useAppSelector((state) => state.user);
  const {
    setAuthorComments,
    setReviewersComments,
    setEditorsComments,
    setVersions,
    setInitialLoading,
  } = articleSlice.actions;
  const dispatch = useAppDispatch();
  const reference: string = uid();

  const paystackConfig: PaystackProps = {
    email: userDetails.email,
    amount: 10000,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ?? '',
    reference,
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = () => {
    dispatch(
      updateStatus({
        status: 'pending',
        articleId: article.id ?? '',
      })
    );

    setIsReload && setIsReload(true);
    toast.success('Payment successful');

    setSendMail &&
      setSendMail({
        state: true,
        type: MailEnum.pubArt,
        id: article.id ?? '',
        refId: reference,
      });
  };

  // you can call this function anything
  const onClose = () => {
    toast.info('Payment canceled');
  };

  const handlePublishClick = () => {
    initializePayment(onSuccess, onClose);
  };

  const [roleClass, setRoleClass] = useState<RoleClassEnum>(RoleClassEnum.auth);

  const authorCommentQuery = query(
    collection(db, `articles/${article.id}/comments/${article.id}/author`),
    orderBy('timestamp', 'asc')
  );

  const reviewersCommentQuery = query(
    collection(db, `articles/${article.id}/comments/${article.id}/reviewers`),
    orderBy('timestamp', 'asc')
  );

  const editorsCommentQuery = query(
    collection(db, `articles/${article.id}/comments/${article.id}/editors`),
    orderBy('timestamp', 'asc')
  );

  const fileVersionQuery = query(
    collection(db, `articles/${article.id}/versions`),
    orderBy('timestamp', 'desc')
  );

  const authorComments = () =>
    onSnapshot(authorCommentQuery, (querySnapshot) => {
      let comments: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const commentData = doc.data();

        comments.push({
          ...commentData,
          timestamp: commentData.timestamp
            ? commentData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setAuthorComments({
          id: article.id,
          newComments: comments as CommentInt[],
          role: userDetails.role,
        })
      );
    });

  const reviewersComment = () =>
    onSnapshot(reviewersCommentQuery, (querySnapshot) => {
      let comments: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const commentData = doc.data();
        comments.push({
          ...commentData,
          timestamp: commentData.timestamp
            ? commentData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setReviewersComments({
          id: article.id,
          newComments: comments as CommentInt[],
          role: userDetails.role,
        })
      );
    });

  const editorsComment = () =>
    onSnapshot(editorsCommentQuery, (querySnapshot) => {
      let comments: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const commentData = doc.data();
        comments.push({
          ...commentData,
          timestamp: commentData.timestamp
            ? commentData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setEditorsComments({
          id: article.id,
          newComments: comments as CommentInt[],
          role: userDetails.role,
        })
      );
    });

  const fileVersion = () =>
    onSnapshot(fileVersionQuery, (querySnapshot) => {
      let versions: DocumentData = [];

      querySnapshot.forEach((doc) => {
        const verData = doc.data();
        versions.push({
          ...verData,
          timestamp: verData.timestamp
            ? verData.timestamp.toDate().toString()
            : '',
        });
      });

      dispatch(
        setVersions({
          id: article.id,
          versions: versions as VerUrlsInt[],
          role: userDetails.role,
        })
      );
    });

  useEffect(() => {
    let unsubAuth: () => void;
    let unsubRev: () => void;
    let unsubEd: () => void;
    let unsubVer: () => void;
    if (isLoggedIn) {
      // console.log('ENTER FIRST');

      unsubVer = fileVersion();

      switch (userDetails.role) {
        case 'author':
          unsubAuth = authorComments();
          dispatch(setInitialLoading(false));
          break;

        case 'reviewer':
          unsubRev = reviewersComment();
          dispatch(setInitialLoading(false));

          break;

        case 'editor':
        case 'admin':
          unsubAuth = authorComments();
          unsubRev = reviewersComment();
          unsubEd = editorsComment();
          dispatch(setInitialLoading(false));

          break;

        default:
          return;
      }
    }

    return () => {
      unsubAuth?.();
      unsubRev?.();
      unsubEd?.();
      unsubVer?.();
    };
  }, [isLoggedIn, userDetails]);

  useEffect(() => {
    switch (userDetails.role) {
      case 'author':
        setRoleClass(RoleClassEnum.auth);
        break;

      case 'reviewer':
        setRoleClass(RoleClassEnum.rev);
        break;

      case 'editor':
        setRoleClass(RoleClassEnum.edi);
        break;

      case 'admin':
        setRoleClass(RoleClassEnum.adm);
        break;

      default:
        return;
    }
  }, [userDetails]);

  // * This is the logic for setting 'new' tag for unread comments
  // Todo Create 4 variables for new comments (3 for author, reviewers, and editors, then the last one is the general one)
  // todo Use the general for both author and reviwer  acct types
  //  todo for editor and admin, set general using or condition of the other 3
  // todo In this file, check all comments to see if the current userId is in the readers, if not, set the respective "new comment variable" to true
  // todo set the respective new comment variable to false once the commentArticleId is populated (will be complex for editors and admin)

  return (
    <>
      <div
        className={`main_opt ${roleClass} ${article.status}_super_wrapper`}
        key={v4()}
      >
        <div className='id_col col'>{article.id}</div>
        <div className='title_col col'>{article.title}</div>
        <div className='categ_col col'>{article.category}</div>

        {userDetails.role !== 'reviewer' && (
          <button
            className={`status_col col ${
              userDetails.role === 'editor' || userDetails.role === 'admin'
                ? 'hover'
                : ''
            } ${article.status}`}
            onClick={
              userDetails.role === 'editor' || userDetails.role === 'admin'
                ? () => setStatusArticleId && setStatusArticleId(article.id)
                : () => {}
            }
          >
            <span>
              {article.status}
              {userDetails.role === 'author' &&
                article.status === StatusEnum.app && (
                  <button className='publish_btn' onClick={handlePublishClick}>
                    Publish
                  </button>
                )}
            </span>
          </button>
        )}

        <button
          className='comment_col col hover'
          onClick={() =>
            setCommentArticleId ? setCommentArticleId(article.id) : ''
          }
          style={!article.comments ? { pointerEvents: 'none' } : {}}
        >
          {!article.comments
            ? 'Loading...'
            : `${
                userDetails.role === 'author'
                  ? article.comments.author?.length
                  : userDetails.role === 'reviewer'
                  ? article.comments.reviewers?.length
                  : userDetails.role === 'editor'
                  ? article.comments.author?.length +
                    article.comments.reviewers?.length
                  : article.comments.author?.length +
                    article.comments.reviewers?.length +
                    article.comments.editors?.length
              }`}
        </button>

        <button
          className='ver_col col hover'
          onClick={() => setVersionArticleId && setVersionArticleId(article.id)}
          style={!article.verUrls ? { pointerEvents: 'none' } : {}}
        >
          {!article.verUrls ? 'Loading...' : article.verUrls?.length}
        </button>

        {(userDetails.role === 'admin' || userDetails.role === 'editor') && (
          <button
            className={`rev_col col ${
              userDetails.role === 'editor' || userDetails.role === 'admin'
                ? 'hover'
                : ''
            }`}
            onClick={() =>
              setReviewersArticleId && setReviewersArticleId(article.id)
            }
          >
            {article.assReviewers?.length}
          </button>
        )}

        {userDetails.role === 'admin' && (
          <button
            className={`edi_col col ${
              userDetails.role === 'admin' ? 'hover' : ''
            }`}
            onClick={() =>
              setEditorsArticleId && setEditorsArticleId(article.id)
            }
          >
            {article.assEditors?.length}
          </button>
        )}
      </div>
    </>
  );
};

export default DashBoardContents;
