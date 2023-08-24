import React, { useState, useEffect } from 'react';
import { BsPrinter, BsDownload, BsPerson } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import imgUrl from '../assets/team/team4.jpg';
import { allArticles, topArticles } from '../data';

const SingleArticle = () => {
  const { id } = useParams();
  const [currentArticle] = useState(
    allArticles.find((article) => article.id === id)
  );
  const [isViewFull, setIsViewFull] = useState(false);

  // TODO ENSURE TO MOP UP THINGS ONCE FIREBASE IS SETUP

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id='single_article_sect'>
      <h3 className='sect_heading'>Article</h3>

      <div className='center_sect'>
        <aside className='main_side'>
          <div className='img_wrapper'>
            <img src={currentArticle?.coverImgUrl} />
          </div>
          <header className='top'>
            <div className='action_btns'>
              <button className='print_btn action_btn'>
                <span className='icon'>
                  <BsPrinter />
                </span>
                Print now
              </button>

              <a className='download_btn action_btn' href='#' download>
                <span className='icon'>
                  <BsDownload />
                </span>
                Download
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
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur molestias architecto vel nesciunt blanditiis omnis
                dolore, vitae officia provident tempore nulla dolorum magni
                reprehenderit et! Ex exercitationem, eos voluptate harum,
                repellat, delectus voluptas reprehenderit ut cum voluptates vel
                repudiandae. At.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque
                aut placeat exercitationem voluptas. Reprehenderit atque cumque,
                illum at perferendis amet sequi eligendi, labore unde in
                architecto! Accusantium error, qui voluptates quis doloremque
                voluptatem quia consequuntur!
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Deleniti dolore esse quae eos laboriosam nam fugit, nesciunt
                nostrum atque odit?
              </p>
            </div>

            <button
              className='view_full_btn'
              onClick={() => setIsViewFull(true)}
            >
              View full article
            </button>

            {isViewFull && (
              <iframe
                className='full_article_win'
                src='https://firebasestorage.googleapis.com/v0/b/devblog-34bb4.appspot.com/o/DIsco%20Config.pdf?alt=media&token=db012183-8296-49e1-8285-f11c83bd5ab2'
              ></iframe>
            )}

            <footer className='action_btns'>
              <button className='print_btn action_btn'>
                <span className='icon'>
                  <BsPrinter />
                </span>
                Print now
              </button>

              <a className='download_btn action_btn' href='#' download>
                <span className='icon'>
                  <BsDownload />
                </span>
                Download
              </a>
            </footer>
          </main>
        </aside>

        <aside className='side_bar'>
          <h3 className='sect_heading'>Other Articles</h3>

          <div className='articles_wrapper'>
            {topArticles.map((article) => (
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
      </div>
    </section>
  );
};

export default SingleArticle;
