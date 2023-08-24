import React from 'react';
import { useGlobalContext } from '../../context';
import { FaTimes } from 'react-icons/fa';

interface DBLPropInt {
  type: string;
  children: React.ReactNode;
}

const DashBoardOverlayLayout: React.FC<DBLPropInt> = ({ type, children }) => {
  const {
    setCommentArticleId,
    setStatusArticleId,
    setReviewersArticleId,
    setVersionArticleId,
    setVerDisplayArticle,
    setEditorsArticleId,
    setIsAddTeam,
    setIsSettings,
  } = useGlobalContext();

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (type) {
      case 'comment':
        setCommentArticleId && setCommentArticleId('');
        break;

      case 'status':
        setStatusArticleId && setStatusArticleId('');
        break;

      case 'reviewers':
        setReviewersArticleId && setReviewersArticleId('');
        break;

      case 'versions':
        setVersionArticleId && setVersionArticleId('');
        setVerDisplayArticle && setVerDisplayArticle(null);
        break;

      case 'editors':
        setEditorsArticleId && setEditorsArticleId('');
        break;

      case 'add to team':
        setIsAddTeam && setIsAddTeam(false);
        break;

      case 'edit profile':
        setIsSettings && setIsSettings(false);
        break;

      default:
        return;
    }
  };

  return (
    <section className='dbl_sect'>
      <div className='dbl_sect_wrapper'>
        <h3 className='sect_heading'>
          {type}
          <button className='close_btn' onClick={handleCloseClick}>
            <FaTimes />
          </button>
        </h3>

        {children}
      </div>
    </section>
  );
};

export default DashBoardOverlayLayout;
