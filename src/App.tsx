import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import Home from './pages/Home';
import Error from './pages/Error';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './pages/components/Navbar';
import Footer from './pages/components/Footer';
import Archives from './pages/Archives';
import AuthorDashboard from './pages/components/dashboard/AuthorDashboard';
import EditorDashboard from './pages/components/dashboard/EditorDashboard';
import ReviewerDashboard from './pages/components/dashboard/ReviewerDashboard';
import AuthorSignUp from './pages/AuthorSignUp';
import Login from './pages/Login';
import SingleArticle from './pages/SingleArticle';
import Team from './pages/Team';
import SubmissionsGuide from './pages/SubmissionGuide';
import Submit from './pages/Submit';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/components/dashboard/AdminDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firbase_config';
import { useAppSelector, useAppDispatch } from './app/store';
import { userSlice } from './features/user/userSlice';
import { getUserInfo } from './features/user/userAsyncThunk';
import Loading from './pages/Loading';
import Verification from './pages/components/Verification';
import { useGlobalContext } from './context';
import {
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import {
  EduJournServices,
  articlesColRef,
  usersColRef,
} from './services/EduJournServices';
import { articleSlice } from './features/article/articleSlice';
import { MailEnum } from './types';
import Confirmations from './pages/components/Confirmations';
import emailjs from '@emailjs/browser';

// ! ADD A 'Scroll to Top' BUTTON. DO NOT FORGET

function App() {
  const {
    setTeamInfo,
    resetIsAlreadyAuth,
    resetIsAlreadyReg,
    setUserAppLoading,
  } = userSlice.actions;
  const {
    setPublishedArticles,
    setAuthorArticles,
    setEditorArticles,
    setReviewerArticles,
    setAllArticles,
    setArticleLoading,
    resetIsFirstEnter,
  } = articleSlice.actions;

  const { sendMail, setSendMail } = useGlobalContext();

  const dispatch = useAppDispatch();
  const { isLoggedIn, isAlreadyAuth, isAlreadyReg, userDetails } =
    useAppSelector((state) => state.user);
  const { isFirstEnter, editorArticles, allArticles } = useAppSelector(
    (state) => state.article
  );

  const eduJournServices = new EduJournServices();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!isLoggedIn && sessionStorage.getItem('userRole')) {
          const email = user.email ? user.email : '';
          dispatch(getUserInfo({ email }));
          console.log('logged in: ', user);
        }
      } else {
        dispatch(setUserAppLoading(false));
        console.log('logged out: ', user);
      }
    });
  }, []);

  useEffect(() => {
    if (isAlreadyAuth) {
      if (!isAlreadyReg)
        toast.info('User already has password set for the regeistered email');
      dispatch(resetIsAlreadyAuth);
    }

    if (isAlreadyReg) {
      toast.error('Account already exists!');
      dispatch(resetIsAlreadyReg);
    }
  }, [isAlreadyAuth, isAlreadyReg]);

  useEffect(() => {
    let unsubPub: () => void;
    let unsubRole: () => void;
    let unsubTeam: () => void;
    if (isLoggedIn) {
      isFirstEnter && dispatch(setArticleLoading(true));

      // *Published Articles
      unsubPub = onSnapshot(
        query(
          articlesColRef,
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc')
        ),
        (querySnapshot) => {
          let articles: DocumentData = [];

          querySnapshot.forEach((doc) => {
            const articleData = doc.data();

            articles.push({
              ...articleData,
              createdAt: articleData.createdAt
                ? articleData.createdAt.toDate().toISOString()
                : '',
            });
          });

          dispatch(setPublishedArticles(articles));
        }
      );

      switch (userDetails.role) {
        case 'author':
          unsubRole = onSnapshot(
            query(
              articlesColRef,
              where('userId', '==', userDetails.id),
              orderBy('createdAt', 'desc')
            ),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toISOString()
                    : '',
                });
              });

              dispatch(setAuthorArticles(articles));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );
          break;

        case 'editor':
          unsubRole = onSnapshot(
            query(
              articlesColRef,
              where('assEditors', 'array-contains', userDetails.id),
              orderBy('createdAt', 'desc')
            ),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toISOString()
                    : '',
                });
              });

              dispatch(setEditorArticles(articles));
            }
          );

          unsubTeam = onSnapshot(
            query(usersColRef, where('role', 'in', ['editor', 'reviewer'])),
            (querySnapshot) => {
              let teamUsers: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const userData = doc.data();
                teamUsers.push(userData);
              });

              dispatch(setTeamInfo(teamUsers));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );
          break;

        case 'reviewer':
          unsubRole = onSnapshot(
            query(
              articlesColRef,
              where('assReviewers', 'array-contains', userDetails.id),
              where('status', '==', 'reviewing'),
              orderBy('createdAt', 'desc')
            ),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toISOString()
                    : '',
                });
              });

              dispatch(setReviewerArticles(articles));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );

          break;

        case 'admin':
          unsubRole = onSnapshot(
            query(articlesColRef, orderBy('createdAt', 'desc')),
            (querySnapshot) => {
              let articles: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const articleData = doc.data();
                articles.push({
                  ...articleData,
                  createdAt: articleData.createdAt
                    ? articleData.createdAt.toDate().toISOString()
                    : '',
                });
              });

              dispatch(setAllArticles(articles));
            }
          );

          unsubTeam = onSnapshot(
            query(usersColRef, where('role', 'in', ['editor', 'reviewer'])),
            (querySnapshot) => {
              let teamUsers: DocumentData = [];

              querySnapshot.forEach((doc) => {
                const userData = doc.data();
                teamUsers.push(userData);
              });

              dispatch(setTeamInfo(teamUsers));
              dispatch(setArticleLoading(false));
              dispatch(resetIsFirstEnter(''));
            }
          );
          break;

        default:
          unsubRole = () => {};
          return;
      }
    }

    return () => {
      unsubPub?.();
      unsubRole?.();
      unsubTeam?.();
    };
  }, [isLoggedIn, userDetails, isFirstEnter]);

  useEffect(() => {
    if (sendMail?.state) {
      let article =
        userDetails.role === 'admin'
          ? allArticles.find((article) => article.id === sendMail.id)!
          : editorArticles.find((article) => article.id === sendMail.id)!;

      switch (sendMail.type) {
        case MailEnum.appArt:
          const appProps = {
            article_id: article.id,
            article_title: article.title,
            user_name: userDetails.name,
            author_name: article.author,
            author_email: article.email,
          };

          emailjs
            .send(
              process.env.REACT_APP_EMAIL_SERVICE_ID ?? '',
              process.env.REACT_APP_EMAIL_APPROVAL_TEMPLATE_ID ?? '',
              appProps,
              process.env.REACT_APP_EMAIL_PUBLIC_KEY ?? ''
            )
            .then((response) => {
              console.log('Approval Email sent successfully:', response);
            })
            .catch((error) => {
              console.error('Error sending Approval email:', error);
            });
          break;

        case MailEnum.rejArt:
          const rejProps = {
            article_id: article.id,
            article_title: article.title,
            user_name: userDetails.name,
            author_name: article.author,
            author_email: article.email,
          };

          emailjs
            .send(
              process.env.REACT_APP_EMAIL_SERVICE_ID ?? '',
              process.env.REACT_APP_EMAIL_REJECTION_TEMPLATE_ID ?? '',
              rejProps,
              process.env.REACT_APP_EMAIL_PUBLIC_KEY ?? ''
            )
            .then((response) => {
              console.log('Rejection Email sent successfully:', response);
            })
            .catch((error) => {
              console.error('Error sending Rejection email:', error);
            });
          break;

        default:
          return;
      }
      setSendMail && setSendMail({ state: false, type: MailEnum.appArt });
    }
  }, [sendMail, editorArticles, setSendMail, allArticles]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />} errorElement={<Error />}>
        <Route index element={<Home />} />
        <Route path='archives' element={<Archives />} />
        <Route path='dashboard' element={<Dashboard />}>
          <Route path='author/:id' element={<AuthorDashboard />} />
          <Route path='editor/:id' element={<EditorDashboard />} />
          <Route path='reviewer/:id' element={<ReviewerDashboard />} />
          <Route path='admin/:id' element={<AdminDashboard />} />
        </Route>
        <Route path='signup' element={<AuthorSignUp />} />
        <Route path='login' element={<Login />} />
        <Route path='article/:id' element={<SingleArticle />} />
        <Route path='our_team' element={<Team />} />
        <Route path='submissions' element={<SubmissionsGuide />} />
        <Route path='submissions/author/:id/' element={<Submit />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;

const Root: React.FC = () => {
  const { superAppLoading, confirmations } = useGlobalContext();
  return (
    <>
      {superAppLoading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <Verification />
          <Outlet />
          <ToastContainer />
          <Confirmations />
          <Footer />
        </>
      )}
    </>
  );
};
