import React, { useEffect, useState, useRef } from 'react';
import { BsSearch, BsPerson } from 'react-icons/bs';
import { allArticles } from '../data';
import { Link } from 'react-router-dom';

// TODO FOR SUBMIT, IF USER IS NOT SIGNED IN, SET lINK TO LOGIN PAGE

const Archives = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPageArticles, setCurrentPageArticles] = useState(
    allArticles.slice(0, 11)
  );
  const displayLimit = useRef(10);
  const [pageCount, setPageCount] = useState(1);
  const [currentPageNumber, setCurrentPageNumber] = useState('1');
  const [pageArray, setPageArray] = useState<number[]>([]);

  useEffect(() => {
    const newArr: number[] = new Array(
      Math.ceil(allArticles.length / displayLimit.current)
    ).fill(0);
    setPageArray(newArr);
  }, [allArticles]);

  useEffect(() => {
    const startPoint = (Number(currentPageNumber) - 1) * displayLimit.current;
    const endPoint = startPoint + displayLimit.current + 1;

    setCurrentPageArticles(allArticles.slice(startPoint, endPoint));
  }, [currentPageNumber]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id='archives_sect'>
      <h2 className='sect_heading'>Archives</h2>

      <div className='center_sect'>
        <div className='left_side'>
          <form className='search_form'>
            <input
              type='text'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search here'
            />
            <button className='search_btn'>
              <BsSearch />
            </button>
          </form>

          <div className='filters_wrapper'>
            <article className='filter_wrapper'>
              <h3 className='heading'>By Category</h3>

              <div className='filter_opts'>
                <article className='filter_opt'>
                  <input type='checkbox' name='category' id='category_all' />
                  <label htmlFor='category_all'>
                    All <span className='filter_opt_count'>(23)</span>
                  </label>
                </article>

                <article className='filter_opt'>
                  <input type='checkbox' name='category' id='physics' />
                  <label htmlFor='physics'>
                    Physics <span className='filter_opt_count'>(12)</span>
                  </label>
                </article>

                <article className='filter_opt'>
                  <input type='checkbox' name='category' id='chemistry' />
                  <label htmlFor='chemistry'>
                    Chemistry <span className='filter_opt_count'>(10)</span>
                  </label>
                </article>

                <article className='filter_opt'>
                  <input type='checkbox' name='category' id='others' />
                  <label htmlFor='others'>
                    Others <span className='filter_opt_count'>(10)</span>
                  </label>
                </article>
              </div>
            </article>

            <article className='filter_wrapper'>
              <h3 className='heading'>By Date</h3>

              <div className='date_range_wrapper'>
                <div className='from_wrapper'>
                  <h3>From</h3>
                  <input type='date' id='date_from' />
                </div>
                <div className='to_wrapper'>
                  <h3>To</h3>
                  <input type='date' />
                </div>
              </div>
            </article>

            <div className='filter_btns'>
              <button className='filter_btn'>Apply</button>
              <button className='filter_btn'>Reset</button>
            </div>
          </div>
        </div>

        <div className='right_side'>
          <header>
            <div className='result_info'>
              Showing <strong>1</strong> to{' '}
              <strong>{displayLimit.current}</strong> of{' '}
              <strong>{allArticles.length}</strong> articles
            </div>

            {/* <div className='display_board'>
              <div className='info'>
                <p>Do you want to upload your article?</p>
                <h3>SUBMIT NOW & make your online presence</h3>
                <Link to='/author/1234/submissions'>Submit Now</Link>
              </div>
            </div> */}

            <div className='sort_wrapper'>
              <select>
                <option value='by_author'>Sort By Author</option>
                <option value='by_title'>Sort By Title</option>
                <option value='by_time'>Sort By Time</option>
              </select>

              <select>
                <option value='asc'>Arrange Asc.</option>
                <option value='dsc'>Arrange Dsc.</option>
              </select>

              <select
                value={currentPageNumber}
                onChange={(e) => setCurrentPageNumber(e.target.value)}
              >
                {pageArray.map((page, index) => (
                  <option value={`${index + 1}`}>Page {index + 1}</option>
                ))}
              </select>
            </div>
          </header>

          <div className='articles_wrapper'>
            {currentPageArticles.map((art) => (
              <article className='article_wrapper' key={art.id}>
                <div className='info'>
                  <div className='author'>
                    <span className='icon'>
                      <BsPerson />
                    </span>
                    <span className='name'>{art.author}</span>
                  </div>

                  <h4 className='title'>
                    <Link to={`/article/${art.id}`}>{art.title}</Link>
                  </h4>
                  <p className='desc'>
                    {art.desc.split(' ').splice(0, 30).join(' ')}...
                  </p>
                  <Link to={`/article/${art.id}`} className='link'>
                    View Full Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Archives;
