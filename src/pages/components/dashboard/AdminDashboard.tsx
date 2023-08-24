import React, { useRef, useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';
import { useGlobalContext } from '../../../context';
import { articleSlice } from '../../../features/article/articleSlice';
import { useAppSelector, useAppDispatch } from '../../../app/store';
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../../../services/firbase_config';
import DashBoardContents from './DashBoardContents';
import { ArticleInfoInt } from '../../../types';

// TODO ENSURE TO HOOK UP displayArticles TO pageSect

const AdminDashboard = () => {
  const header = useRef([
    'Id',
    'Title',
    'Category',
    'Status',
    'Comments',
    "Vers'",
    "Rev'ers",
    'Editors',
  ]);
  const { pageSect } = useGlobalContext();

  // ? Author comment contains comments between editor(s) and author
  // ? Reviewers comment contains comments between editor(s) and reviewwers
  // ? Editor comment contains comments between chief editor and editor(s)
  // ? All these are for the specific article

  const { allArticles } = useAppSelector((state) => state.article);
  const [displayArticles, setDisplayArticles] = useState<ArticleInfoInt[]>([]);

  useEffect(() => {
    let modDispArticles: ArticleInfoInt[];
    switch (pageSect) {
      case 'all':
        modDispArticles = allArticles;
        break;

      case 'rev':
        modDispArticles = allArticles.filter(
          (article) => article.status === 'reviewing'
        );
        break;

      case 'sub':
        modDispArticles = allArticles.filter(
          (article) => article.status === 'submitted'
        );
        break;

      default:
        return;
    }

    setDisplayArticles(modDispArticles);
  }, [pageSect, allArticles]);

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

export default AdminDashboard;
