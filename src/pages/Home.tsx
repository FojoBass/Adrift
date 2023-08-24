import React, { useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import { topArticles } from '../data';
import { Link } from 'react-router-dom';
import { userSlice } from '../features/user/userSlice';
import { useAppDispatch } from '../app/store';
import { useGlobalContext } from '../context';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const { setIsLoggedIn } = userSlice.actions;
  const dispatch = useAppDispatch();
  const { justLoggedOut, setJustLoggedOut } = useGlobalContext();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (justLoggedOut && setJustLoggedOut && location.pathname.length === 1) {
      dispatch(setIsLoggedIn(false));
      setJustLoggedOut(false);
    }
  }, [setJustLoggedOut, justLoggedOut, location]);
  return (
    <section id='home_sect' className='defaults'>
      <Hero />

      <section className='top_articles_sect center_sect'>
        <h2 className='sect_heading'>Top Articles</h2>

        <div className='top_articles_wrapper'>
          {topArticles.map((article, index) => (
            <div className='top_article_wrapper' key={index}>
              <Link to={`/article/${article.id}`} className='title'>
                {article.title}
              </Link>
              <div className='bottom'>
                <span className='author_name'>{article.author}</span>
                <div className='right_side'>
                  <span className='category'>{article.category}</span>
                  <span className='date_created'>Feb 17 1999</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <About />
    </section>
  );
};

export default Home;
