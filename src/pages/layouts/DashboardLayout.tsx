import React, { useRef, useEffect, useState } from 'react';
import { TfiReload } from 'react-icons/tfi';
import {
  BsListTask,
  BsPersonPlus,
  BsGear,
  BsHddStack,
  BsPeople,
  BsFillArrowRightSquareFill,
  BsFillArrowLeftSquareFill,
} from 'react-icons/bs';
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { FiLogOut } from 'react-icons/fi';
import { v4 } from 'uuid';
import Comments from '../components/dashboard/comments/Comments';
import { useGlobalContext } from '../../context';
import Status from '../components/dashboard/Status';
import Versions from '../components/dashboard/Versions';
import Reviewers from '../components/dashboard/Reviewers';
import Editors from '../components/dashboard/Editors';
import AddTeam from '../components/dashboard/AddTeam';
import Settings from '../components/dashboard/Settings';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArticleInfoInt, PageSectEnum, StatusEnum } from '../../types';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { articleSlice } from '../../features/article/articleSlice';
import Categories from '../components/dashboard/Categories';
import Authors from '../components/dashboard/Authors';
import AllAuthors from '../components/dashboard/AllAuthors';

interface DashboardLayoutPropInt {
  headerContent: string[];
  children: React.ReactNode;
}

// Todo ADD LIST TO THE PROPS, SO THAT THE INFO IS SENT HERE, AND PAGINATION CAN BE SMOTTHLY SET UP

const DashboardLayout: React.FC<DashboardLayoutPropInt> = ({
  headerContent,
  children,
}) => {
  const {
    userDetails: { name, role, affiliation },
  } = useAppSelector((state) => state.user);

  const {
    editorArticles,
    allArticles,
    justPublished,
    isPublishing,
    currentIssue,
    isPublishingFailed,
  } = useAppSelector((state) => state.article);

  const { setJustPublished, setIsPublishingFailed } = articleSlice.actions;

  const [isDashMenuOpen, setIsDashMenuOpen] = useState(false);

  const [dummyPageArr, setDummyPageArr] = useState<''[]>([]);

  const centerRef = useRef<HTMLDivElement | null>(null);
  const dashNavRef = useRef<HTMLDivElement | null>(null);

  const {
    commentArticleId,
    statusArticleId,
    reviewersArticleId,
    versionArticleId,
    authorsArticleId,
    editorsArticleId,
    pageSect,
    setPageSect,
    isAddTeam,
    setIsAddTeam,
    isSettings,
    setIsSettings,
    verErrorMsg,
    logOut,
    setIsDemo,
    isLoggingOut,
    justLoggedOut,
    isReload,
    setIsReload,
    setConfirmations,
    dashStatusFilter,
    setDashStatusFilter,
    setDashPageNumber,
    dashArticlesPerPage,
    dashPageNumber,
    grandModArticles,
    setIsCategories,
    isCategories,
    isAuthors,
    setIsAuthors,
  } = useGlobalContext();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isSmallWin, setIsSmallWin] = useState(false);

  const [isTimer, setIsTimer] = useState(true);

  const gridStyleRef = useRef({
    gridTemplateColumns: `${
      role === 'author'
        ? '1.25fr 3fr 2fr 1fr 1.25fr 1fr'
        : role === 'editor'
        ? '1.25fr 3fr 2fr 1fr 1.25fr 1fr 1fr 1fr'
        : role === 'reviewer'
        ? '1.25fr 3fr 2fr 1.25fr 1fr'
        : '1.25fr 3fr 2fr 1fr 1.25fr 1fr 1fr 1fr 1fr'
    }`,
  });

  useEffect(() => {
    if (justLoggedOut) {
      navigate('/');
    }
  }, [justLoggedOut]);

  useEffect(() => {
    if (verErrorMsg?.includes('request'))
      toast.error('Too many frequent request made!');
  }, [verErrorMsg]);

  useEffect(() => {
    const reloadTimeout = setTimeout(() => {
      if (isReload) setIsReload && setIsReload(false);
    }, 1000);

    return () => clearTimeout(reloadTimeout);
  }, [isReload]);

  useEffect(() => {
    if (justPublished) {
      toast.success('Articles Published');
      dispatch(setJustPublished(false));
    }

    if (isPublishingFailed) {
      toast.error('Articles Publishing failed!');
      dispatch(setIsPublishingFailed(false));
    }
  }, [justPublished, isPublishingFailed]);

  useEffect(() => {
    if (dashArticlesPerPage) {
      let modArticles: ArticleInfoInt[] = grandModArticles ?? [];

      switch (dashStatusFilter) {
        case 'all':
          break;
        case StatusEnum.sub:
          modArticles = modArticles.filter(
            (art) => art.status === StatusEnum.sub
          );
          break;
        case StatusEnum.rev:
          modArticles = modArticles.filter(
            (art) => art.status === StatusEnum.rev
          );
          break;
        case StatusEnum.rej:
          modArticles = modArticles.filter(
            (art) => art.status === StatusEnum.rej
          );
          break;
        case StatusEnum.app:
          modArticles = modArticles.filter(
            (art) => art.status === StatusEnum.app
          );
          break;
        case StatusEnum.pen:
          modArticles = modArticles.filter(
            (art) => art.status === StatusEnum.pen
          );
          break;
        case StatusEnum.pub:
          modArticles = modArticles.filter(
            (art) => art.status === StatusEnum.pub
          );
          break;

        default:
          return;
      }

      const pageCount = Math.ceil(modArticles.length / dashArticlesPerPage);

      setDummyPageArr(new Array(pageCount).fill(''));
    }
  }, [grandModArticles, dashArticlesPerPage, dashStatusFilter, pageSect]);

  useEffect(() => {
    if (window.innerWidth <= 1270 && !isSmallWin) setIsSmallWin(true);
    window.onresize = () => {
      if (window.innerWidth <= 1270 && !isSmallWin) setIsSmallWin(true);
      if (window.innerWidth > 1270 && isSmallWin) setIsSmallWin(false);
    };

    return () => window.removeEventListener('resize', () => {});
  }, [isSmallWin]);

  // todo Comment all translation styles in the scss
  // todo Control translation from useEffect

  useEffect(() => {
    if (centerRef.current && dashNavRef.current) {
      const centerEl = centerRef.current;
      const dashNavEl = dashNavRef.current;
      const dashNavWidth = dashNavEl.getBoundingClientRect().width;
      const dashInitialTrans = window
        .getComputedStyle(dashNavEl)
        .transform.split(',')[4]
        ? Number(window.getComputedStyle(dashNavEl).transform.split(',')[4]) -
          centerEl.scrollLeft
        : 0;
      const offSet = dashNavWidth + 20;

      if (isSmallWin) {
        dashNavEl.style.transition = 'none';

        if (isDashMenuOpen) {
          dashNavEl.style.transform = `translateX(${
            dashInitialTrans + offSet + centerEl.scrollLeft
          }px)`;
        } else {
          dashNavEl.style.transform = `translateX(${
            dashInitialTrans - offSet + centerEl.scrollLeft
          }px)`;
        }

        dashNavEl.style.transition = 'all ease 0.3s';

        centerEl.onscroll = () => {
          const remAddeddSize = isDashMenuOpen
            ? dashInitialTrans + offSet
            : dashInitialTrans - offSet;

          dashNavEl.style.transition = 'none';

          dashNavEl.style.transform = `translateX(${
            remAddeddSize + centerEl.scrollLeft
          }px)`;
        };

        dashNavEl.style.transition = 'all ease 0.3s';
      } else {
        dashNavEl.style.transform = `translateX(${
          Number(dashInitialTrans) + centerEl.scrollLeft
        }px)`;
      }
    }
  }, [isSmallWin, centerRef, dashNavRef, isDashMenuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimer(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  //todo MAKE THE SIDEBAR MOVE TOGETHER WITH SCROLL, SO THAT IT WILL ALWAYS BE FIXED ON THE SCREEN
  // todo ALSO, ENSURE TO MAKE ALL OVERLAYS RESPONSIVE

  return (
    <section id='dashboard_sect'>
      <h3 className='sect_heading'>
        <button
          className='dash_menu_btn'
          onClick={() => setIsDashMenuOpen(!isDashMenuOpen)}
        >
          {isDashMenuOpen ? (
            <BsFillArrowLeftSquareFill />
          ) : (
            <BsFillArrowRightSquareFill />
          )}
        </button>
        {role} dashboard
      </h3>
      <div className='center_sect' ref={centerRef}>
        <nav
          className={`nav_side dashboard_sides`}
          ref={dashNavRef}
          style={
            isSmallWin && isTimer
              ? { opacity: 0 }
              : { transition: 'all ease 0.3s', opacity: 1 }
          }
        >
          <div className='top_side'>
            <h3 className='user_name'>{name}</h3>
            <p className='affil'>{affiliation}</p>
            <p className='user_role'>{role}</p>
          </div>

          <div className='nav_opts'>
            <button
              className={`nav_opt ${
                pageSect === PageSectEnum.all ? 'active' : ''
              }`}
              onClick={() => setPageSect && setPageSect(PageSectEnum.all)}
            >
              <span className='icon'>
                <BsListTask />
              </span>
              <span className='title'>Article List</span>
            </button>

            {role === 'admin' && (
              <>
                <button
                  className='nav_opt'
                  onClick={() => setIsAddTeam && setIsAddTeam(true)}
                >
                  <span className='icon'>
                    <BsPersonPlus />
                  </span>
                  <span className='title'>Add Team Member</span>
                </button>

                <button
                  className='nav_opt'
                  onClick={() => setIsCategories && setIsCategories(true)}
                >
                  <span className='icon'>
                    <BsHddStack />
                  </span>
                  <span className='title'>View Categories</span>
                </button>

                <button
                  className='nav_opt'
                  onClick={() => setIsAuthors && setIsAuthors(true)}
                >
                  <span className='icon'>
                    <BsPeople />
                  </span>
                  <span className='title'>View Authors</span>
                </button>
              </>
            )}

            <button
              className='nav_opt'
              onClick={() => setIsSettings && setIsSettings(true)}
            >
              <span className='icon'>
                <BsGear />
              </span>
              <span className='title'>Edit Profile</span>
            </button>

            <button
              className='nav_opt'
              onClick={() => {
                logOut && logOut();
                setIsDemo && setIsDemo(false);
              }}
              style={
                isLoggingOut ? { opacity: '0.5', cursor: 'not-allowed' } : {}
              }
            >
              <span className='icon'>
                <FiLogOut />
              </span>
              <span className='title'>
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </span>
            </button>
          </div>
        </nav>

        <aside className='main_side dashboard_sides'>
          <header className='header_opts'>
            {role !== 'reviewer' && (
              <select
                className='sorting'
                value={dashStatusFilter}
                onChange={(e) =>
                  setDashStatusFilter &&
                  setDashStatusFilter(e.target.value as StatusEnum | 'all')
                }
              >
                <option value='all'>All</option>
                <option value={StatusEnum.sub}>Submitted</option>
                <option value={StatusEnum.rev}>Reviewing</option>
                <option value={StatusEnum.app}>Approved</option>
                <option value={StatusEnum.rej}>Rejected</option>
                <option value={StatusEnum.pen}>Pending</option>
                <option value={StatusEnum.pub}>Published</option>
              </select>
            )}

            <div className='header_opt_wrapper' style={gridStyleRef.current}>
              {headerContent.map((head) => (
                <h4 className='header_opt' key={v4()}>
                  {head}
                </h4>
              ))}
            </div>
          </header>

          <main className='table_body'>
            {isReload ? 'Loading...' : children}
          </main>

          <footer>
            <select
              className='pagination'
              value={dashPageNumber}
              onChange={(e) =>
                setDashPageNumber && setDashPageNumber(Number(e.target.value))
              }
            >
              {dummyPageArr.map((dum, ind) => (
                <option value={ind + 1} key={ind}>
                  {ind + 1}
                </option>
              ))}
            </select>

            {role === 'admin' && (
              <button
                className='publish_art_btn'
                onClick={() =>
                  setConfirmations &&
                  setConfirmations({
                    isShow: true,
                    msg: `publish all pending articles to issue ${currentIssue}`,
                    type: 'publish',
                  })
                }
                style={
                  isPublishing
                    ? {
                        opacity: '0.5',
                        cursor: 'not-allowed',
                      }
                    : {}
                }
                disabled={isPublishing}
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            )}
          </footer>
        </aside>
      </div>

      {commentArticleId && <Comments />}
      {statusArticleId && (
        <Status
          roleArticles={role === 'editor' ? editorArticles : allArticles}
        />
      )}
      {reviewersArticleId && <Reviewers />}
      {versionArticleId && <Versions />}
      {editorsArticleId && <Editors />}
      {isAddTeam && <AddTeam />}
      {isSettings && <Settings />}
      {isCategories && <Categories />}
      {authorsArticleId && <Authors />}
      {isAuthors && <AllAuthors />}
    </section>
  );
};

export default DashboardLayout;
