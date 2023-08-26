import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import { TfiReload } from 'react-icons/tfi';
import { BsListTask, BsPersonPlus, BsGear } from 'react-icons/bs';
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
import { PageSectEnum } from '../../types';

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

  const { editorArticles, allArticles } = useAppSelector(
    (state) => state.article
  );

  const {
    commentArticleId,
    statusArticleId,
    reviewersArticleId,
    versionArticleId,
    editorsArticleId,
    pageSect,
    setPageSect,
    isAddTeam,
    setIsAddTeam,
    isSettings,
    setIsSettings,
    verErrorMsg,
    logOut,
    isLoggingOut,
    justLoggedOut,
    isReload,
    setIsReload,
    setConfirmations,
  } = useGlobalContext();

  const navigate = useNavigate();

  const gridStyleRef = useRef({
    gridTemplateColumns: `${
      role === 'author'
        ? '1.25fr 3fr 2fr 1fr 1.25fr 1fr'
        : role === 'editor'
        ? '1.25fr 3fr 2fr 1fr 1.25fr 1fr 1fr'
        : role === 'reviewer'
        ? '1.25fr 3fr 2fr 1.25fr 1fr'
        : '1.25fr 3fr 2fr 1fr 1.25fr 1fr 1fr 1fr'
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

  return (
    <section id='dashboard_sect'>
      <h3 className='sect_heading'>{role} dashboard</h3>
      <div className='center_sect'>
        <nav className='nav_side dashboard_sides'>
          <div className='top_side'>
            <h3 className='user_name'>{name}</h3>
            <p className='affil'>{affiliation}</p>
            <p className='user_role'>{role}</p>
          </div>

          <div className='nav_opts'>
            {role === 'admin' && (
              <button
                className={`nav_opt ${
                  pageSect === PageSectEnum.sub ? 'active' : ''
                }`}
                onClick={() => setPageSect && setPageSect(PageSectEnum.sub)}
              >
                <span className='icon'>
                  <HiOutlineClipboardDocumentList />
                </span>
                <span className='title'>Articles to be Reviewed</span>
              </button>
            )}

            <button
              className={`nav_opt ${
                pageSect === PageSectEnum.rev ? 'active' : ''
              }`}
              onClick={() => setPageSect && setPageSect(PageSectEnum.rev)}
            >
              <span className='icon'>
                <TfiReload />
              </span>
              <span className='title'>Articles Under Review</span>
            </button>

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
              onClick={() => logOut && logOut()}
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
            <select className='sorting'>
              <option value='all'>All</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
              <option value='published'>Published</option>
            </select>

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
            <select className='pagination'>
              <option value='1'>Page 1</option>
            </select>

            <button
              className='publish_art_btn'
              onClick={() =>
                setConfirmations &&
                setConfirmations({
                  isShow: true,
                  msg: 'publish all pending articles',
                  type: 'publish',
                })
              }
            >
              Publish Vol.
            </button>
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
    </section>
  );
};

export default DashboardLayout;
