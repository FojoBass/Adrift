import React, { useState, useEffect } from 'react';
import { BsPrinter, BsDownload, BsPerson } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import imgUrl from '../assets/team/team4.jpg';
import { allArticles, topArticles } from '../data';
import { useAppSelector, useAppDispatch } from '../app/store';
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../services/firbase_config';
import { ArticleInfoInt, VerUrlsInt } from '../types';
import { articleSlice } from '../features/article/articleSlice';
import { EduJournServices } from '../services/EduJournServices';

// TODO SET UP VER URLS FOR PUBLISHE ARTICLES

const SingleArticle = () => {
  const { publishedArticles } = useAppSelector((state) => state.article);
  const dispatch = useAppDispatch();

  const { setVersions } = articleSlice.actions;

  const { id } = useParams();
  const [currentArticle, setCurrentArticle] = useState<ArticleInfoInt | null>(
    publishedArticles.find((article) => article.id === id) ?? null
  );
  const [isViewFull, setIsViewFull] = useState(false);

  const [otherArticles, setOtherArticles] = useState<ArticleInfoInt[]>([]);

  const fetchVersions = async () => {
    const querySnapshot = await new EduJournServices().getVersions(id ?? '');
    let versions: DocumentData = [];

    querySnapshot.forEach((doc) => {
      const verData = doc.data();
      versions.push({
        ...verData,
        timestamp: verData.timestamp
          ? verData.timestamp.toDate().toString()
          : '',
      });
    });

    dispatch(
      setVersions({
        id: id ?? '',
        versions: versions as VerUrlsInt[],
        role: 'published',
      })
    );
  };

  useEffect(() => {
    setCurrentArticle(
      publishedArticles.find((article) => article.id === id) ?? null
    );
    if (!otherArticles.length) {
      let modArticles: ArticleInfoInt[] = [];

      for (let i = 0; i < 3; i++) {
        const randInd = Math.floor(Math.random() * publishedArticles.length);
        modArticles.push(publishedArticles[randInd]);
        setOtherArticles(modArticles);
      }
    }
  }, [publishedArticles, otherArticles, id]);

  useEffect(() => {
    setOtherArticles([]);
    if (!publishedArticles.find((article) => article.id === id)?.verUrls)
      fetchVersions();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   console.log('currentArticle: ', currentArticle);
  // }, [currentArticle]);

  return (
    <section id='single_article_sect'>
      <h3 className='sect_heading'>Article</h3>

      <div className='center_sect'>
        {currentArticle ? (
          currentArticle.verUrls ? (
            <>
              <aside className='main_side'>
                {/* <div className='img_wrapper'>
            <img src={currentArticle?.coverImgUrl} />
          </div> */}
                <header className='top'>
                  <div className='action_btns'>
                    {/* <button className='print_btn action_btn'>
                    <span className='icon'>
                      <BsPrinter />
                    </span>
                    Print now
                  </button> */}

                    <a
                      className='download_btn action_btn'
                      href={currentArticle.verUrls[0].mainUrl}
                      download
                    >
                      <span className='icon'>
                        <BsDownload />
                      </span>
                      Download PDF
                    </a>
                  </div>

                  <div className='title_wrapper'>
                    <h2 className='title'>{currentArticle?.title}</h2>
                    <div className='author_name'>
                      <span className='icon'>
                        <BsPerson />
                      </span>
                      {currentArticle?.author}
                    </div>
                  </div>
                </header>

                <main className='main_article'>
                  <h3 className='heading'>Abstract</h3>

                  <div className='text_wrapper'>
                    <p>{currentArticle.abstract}</p>
                  </div>

                  {/* <button
                  className='view_full_btn'
                  onClick={() => setIsViewFull(true)}
                >
                  View full article
                </button>

                {isViewFull && (
                  <iframe
                    className='full_article_win'
                    src={currentArticle.verUrls[0].mainUrl}
                  ></iframe>
                )} */}

                  <footer className='action_btns'>
                    {/* <button className='print_btn action_btn'>
                    <span className='icon'>
                      <BsPrinter />
                    </span>
                    Print now
                  </button> */}

                    <a
                      className='download_btn action_btn'
                      href={currentArticle.verUrls[0].mainUrl}
                      download
                    >
                      <span className='icon'>
                        <BsDownload />
                      </span>
                      Download PDF
                    </a>
                  </footer>
                </main>
              </aside>

              <aside className='side_bar'>
                <h3 className='sect_heading'>Other Articles</h3>

                <div className='articles_wrapper'>
                  {otherArticles.map((article) => (
                    <Link
                      to={`/article/${article.id}`}
                      className='other_article'
                      key={article.id}
                    >
                      <div className='author'>
                        <span className='icon'>
                          <BsPerson />
                        </span>
                        <span className='author_name'>{article.author}</span>
                      </div>
                      <p className='title'>{article.title}</p>
                    </Link>
                  ))}
                </div>
              </aside>
            </>
          ) : (
            <h2 className='no_article'>Loading ...</h2>
          )
        ) : (
          <h2 className='no_article'>Article does not exist!</h2>
        )}
      </div>
    </section>
  );
};

export default SingleArticle;
