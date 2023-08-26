import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../context';
import { useAppDispatch, useAppSelector } from '../app/store';
import { articleSlice } from '../features/article/articleSlice';
import { updateStatus } from '../features/article/articleAsyncuThunk';

const Dashboard = () => {
  const { userDetails, isLoggedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { affirm, setAffirm } = useGlobalContext();
  const { allArticles } = useAppSelector((state) => state.article);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) navigate(`${userDetails.role}/${userDetails.id}`);
    else {
      console.log('Called');
      toast.info('Login to access page', { toastId: 'login_toast' });
      navigate('/login');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (affirm?.type === 'publish') {
      console.log('publishing');
    }
  }, [affirm]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default Dashboard;
