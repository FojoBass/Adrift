import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../app/store';
import { v4 } from 'uuid';
import { ArticleInfoInt, CommentsInt, TargetEnum } from '../../../../types';
import { timeConverter } from '../../../../helpers/timeConverter';
import { BsBellFill } from 'react-icons/bs';
import { useGlobalContext } from '../../../../context';
import { EduJournServices } from '../../../../services/EduJournServices';

interface AdminEditorCommentPropInt {
  comments: CommentsInt;
}

enum NavOpt {
  auth = 'author',
  rev = 'reviewers',
  edi = 'editors',
}

const AdminEditorComment: React.FC<AdminEditorCommentPropInt> = ({
  comments,
}) => {
  const {
    userDetails: { role, id },
  } = useAppSelector((state) => state.user);

  const { editorArticles, allArticles } = useAppSelector(
    (state) => state.article
  );

  const [displayComments, setDisplayComments] = useState(comments?.author);
  const [navOpt, setNavOpt] = useState<NavOpt>(NavOpt.auth);
  const [displayArticle, setDisplayArticle] = useState<ArticleInfoInt | null>(
    null
  );
  const [isNewComments, setIsNewComments] = useState({
    author: false,
    reviewers: false,
    editors: false,
  });

  const { commentArticleId } = useGlobalContext();

  const eduJourn = new EduJournServices();

  useEffect(() => {
    role === 'editor'
      ? setDisplayArticle(
          editorArticles.find((art) => art.id === commentArticleId) ?? null
        )
      : setDisplayArticle(
          allArticles.find((art) => art.id === commentArticleId) ?? null
        );
  }, [editorArticles, allArticles]);

  useEffect(() => {
    setDisplayComments(comments[navOpt]);

    if (displayArticle) {
      switch (navOpt) {
        case NavOpt.auth:
          const latestAuthComment =
            displayArticle.comments.author[
              displayArticle.comments.author.length - 1
            ];

          if (
            latestAuthComment &&
            !latestAuthComment?.readers.find((reader) => reader === id)
          ) {
            (function async() {
              try {
                eduJourn.viewComment(
                  latestAuthComment.id,
                  [...latestAuthComment.readers, id],
                  displayArticle.id,
                  TargetEnum.auth
                );
              } catch (err) {
                console.log(`Failed to update comment ${err}`);
              }
            })();
          }

          break;

        case NavOpt.rev:
          const latestRevComment =
            displayArticle.comments.reviewers[
              displayArticle.comments.reviewers.length - 1
            ];

          if (
            latestRevComment &&
            !latestRevComment?.readers.find((reader) => reader === id)
          ) {
            (function async() {
              try {
                eduJourn.viewComment(
                  latestRevComment.id,
                  [...latestRevComment.readers, id],
                  displayArticle.id,
                  TargetEnum.rev
                );
              } catch (err) {
                console.log(`Failed to update comment ${err}`);
              }
            })();
          }
          break;

        case NavOpt.edi:
          const latestEdiComment =
            displayArticle.comments.editors[
              displayArticle.comments.editors.length - 1
            ];

          if (
            latestEdiComment &&
            !latestEdiComment?.readers.find((reader) => reader === id)
          ) {
            (function async() {
              try {
                eduJourn.viewComment(
                  latestEdiComment.id,
                  [...latestEdiComment.readers, id],
                  displayArticle.id,
                  TargetEnum.edi
                );
              } catch (err) {
                console.log(`Failed to update comment ${err}`);
              }
            })();
          }
          break;

        default:
          return;
      }
    }
  }, [navOpt, comments, displayArticle]);

  useEffect(() => {
    if (comments.author.length) {
      let isNew = false;
      for (let i = comments.author.length - 1; i >= 0; i--) {
        if (!comments.author[i].readers.find((reader) => reader === id)) {
          isNew = true;
          break;
        } else if (i === comments.author.length - 1) break;
      }
      setIsNewComments({ ...isNewComments, author: isNew });
    }

    if (comments.reviewers.length) {
      let isNew = false;
      for (let i = comments.reviewers.length - 1; i >= 0; i--) {
        if (!comments.reviewers[i].readers.find((reader) => reader === id)) {
          isNew = true;
          break;
        } else if (i === comments.reviewers.length - 1) break;
      }
      setIsNewComments({ ...isNewComments, reviewers: isNew });
    }

    if (comments.editors.length) {
      let isNew = false;
      for (let i = comments.editors.length - 1; i >= 0; i--) {
        if (!comments.editors[i].readers.find((reader) => reader === id)) {
          isNew = true;
          break;
        } else if (i === comments.editors.length - 1) break;
      }
      setIsNewComments({ ...isNewComments, editors: isNew });
    }
  }, [comments]);

  return (
    <div className='chat_sect'>
      <nav className='btns_wrapper'>
        <button
          className={`nav_btn ${navOpt === 'author' ? 'active' : ''}`}
          onClick={() => setNavOpt(NavOpt.auth)}
        >
          Author
          {isNewComments.author && (
            <span className='new_tag'>
              <BsBellFill />
            </span>
          )}
        </button>
        <button
          className={`nav_btn ${navOpt === 'reviewers' ? 'active' : ''}`}
          onClick={() => setNavOpt(NavOpt.rev)}
        >
          Reviewers
          {isNewComments.reviewers && (
            <span className='new_tag'>
              <BsBellFill />
            </span>
          )}
        </button>
        <button
          className={`nav_btn ${navOpt === 'editors' ? 'active' : ''}`}
          onClick={() => setNavOpt(NavOpt.edi)}
        >
          Editors
          {isNewComments.editors && (
            <span className='new_tag'>
              <BsBellFill />
            </span>
          )}
        </button>
      </nav>

      <div className='comments'>
        {displayComments.map(({ senderId, message, timestamp, name }) => {
          const commentTime = timeConverter(timestamp);

          return (
            <article
              key={v4()}
              className={`comment ${senderId === id ? 'my_msg' : ''}`}
            >
              <p className='msg_wrapper'>{message}</p>
              <div className='footer'>
                <span className='msg_sender'>
                  {senderId === id ? 'Me' : name}
                </span>
                <span className='msg_time'>
                  <span className='date_wrapper'>
                    {commentTime.getDate()} /{' '}
                    {String(commentTime.getMonth()).length < 2
                      ? `0${commentTime.getMonth()}`
                      : commentTime.getMonth()}{' '}
                    / {String(commentTime.getFullYear()).slice(2)}
                  </span>

                  <span className='time_wrapper'>
                    {String(commentTime.getHours()).length < 2
                      ? `0${commentTime.getHours()}`
                      : commentTime.getHours()}{' '}
                    :{' '}
                    {String(commentTime.getMinutes()).length < 2
                      ? `0${commentTime.getMinutes()}`
                      : commentTime.getMinutes()}
                  </span>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AdminEditorComment;
