import React, { useEffect } from 'react';
import { useAppSelector } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { userDetails, isLoggedIn } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) navigate(`${userDetails.role}/${userDetails.id}`);
    else {
      console.log('Called');
      toast.info('Login to access page', { toastId: 'login_toast' });
      navigate('/login');
    }
  }, [isLoggedIn]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default Dashboard;
