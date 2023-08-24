import React, { useRef, useState, useEffect } from 'react';
import ShortUniqueId from 'short-unique-id';
import { v4 } from 'uuid';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useGlobalContext } from '../../../context';
import {
  articleSlice,
} from '../../../features/article/articleSlice';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import DashBoardContents from './DashBoardContents';
import { ArticleInfoInt } from '../../../types';

const EditorDashboard = () => {
  const header = useRef([
    'Id',
    'Title',
    'Category',
    'Status',
    'Comments',
    "Vers'",
    "Rev'ers",
  ]);

  // ? Author comment contains comments between editor(s) and author
  // ? Reviewers comment contains comments between editor(s) and reviewwers
  // ? Editor comment contains comments between chief editor and editor(s)
  // ? All these are for the specific article

  const { pageSect } = useGlobalContext();
  const { editorArticles } = useAppSelector((state) => state.article);
  const [displayArticles, setDisplayArticles] = useState<ArticleInfoInt[]>([]);

  useEffect(() => {
    let modDispArticles: ArticleInfoInt[];
    switch (pageSect) {
      case 'all':
        modDispArticles = editorArticles;
        break;

      case 'rev':
        modDispArticles = editorArticles.filter(
          (article) => article.status === 'reviewing'
        );
        break;

      default:
        return;
    }

    setDisplayArticles(modDispArticles);
  }, [pageSect, editorArticles]);

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

export default EditorDashboard;
