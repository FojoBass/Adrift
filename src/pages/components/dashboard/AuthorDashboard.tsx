import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import DashboardLayout from '../../layouts/DashboardLayout';
import DashBoardContents from './DashBoardContents';
import { useGlobalContext } from '../../../context';
import { ArticleInfoInt } from '../../../types';

const AuthorDashboard = () => {
  const header = useRef([
    'Id',
    'Title',
    'Category',
    'Status',
    'Comments',
    'Versions',
  ]);

  // ? Author comment contains comments between editor(s) and author
  // ? Reviewers comment contains comments between editor(s) and reviewwers
  // ? Editor comment contains comments between chief editor and editor(s)
  // ? All these are for the specific article

  const { authorArticles } = useAppSelector((state) => state.article);
  const [displayArticles, setDisplayArticles] = useState<ArticleInfoInt[]>([]);
  const { pageSect } = useGlobalContext();

  useEffect(() => {
    let modDispArticles: ArticleInfoInt[];
    switch (pageSect) {
      case 'all':
        modDispArticles = authorArticles;
        break;

      case 'rev':
        modDispArticles = authorArticles.filter(
          (article) => article.status === 'reviewing'
        );
        break;

      default:
        return;
    }

    setDisplayArticles(modDispArticles);
  }, [pageSect, authorArticles]);

  return (
    <DashboardLayout headerContent={header.current}>
      {displayArticles.length ? (
        displayArticles.map((article) => (
          <DashBoardContents article={article} />
        ))
      ) : (
        <h3>No article</h3>
      )}
    </DashboardLayout>
  );
};

export default AuthorDashboard;
