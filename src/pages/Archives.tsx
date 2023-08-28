import React, { useEffect, useState, useRef } from 'react';
import { BsSearch, BsPerson } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { ArticleInfoInt } from '../types';
import { useAppDispatch, useAppSelector } from '../app/store';
import { toast } from 'react-toastify';

// TODO FOR SUBMIT, IF USER IS NOT SIGNED IN, SET lINK TO LOGIN PAGE

const Archives = () => {
  const { publishedArticles, volCount } = useAppSelector(
    (state) => state.article
  );

  const [searchValue, setSearchValue] = useState('');
  const [currentPageArticles, setCurrentPageArticles] = useState<
    ArticleInfoInt[]
  >([]);
  const displayLimit = useRef(10);
  const [pageCount, setPageCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [sort, setSort] = useState('title');
  const [order, setOrder] = useState('asc');
  const [displayArticles, setDisplayArticles] =
    useState<ArticleInfoInt[]>(publishedArticles);
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');

  const handleReset = (e: React.MouseEvent) => {
    setFromYear('');
    setToYear('');
    setSearchValue('');
  };

  const handleApply = (e: React.MouseEvent) => {
    let modArticles = publishedArticles;

    if (fromYear && toYear) {
      if (validateYear(fromYear) && validateYear(toYear)) {
        modArticles =
          modArticles.filter(
            (art) =>
              Number((art.publishedAt as string).split(' ')[3]) >=
                Number(fromYear) &&
              Number((art.publishedAt as string).split(' ')[3]) <=
                Number(toYear)
          ) ?? [];
        setDisplayArticles(modArticles);
      }
    } else if (fromYear && !toYear) {
      if (validateYear(fromYear)) {
        modArticles =
          modArticles.filter(
            (art) =>
              Number((art.publishedAt as string).split(' ')[3]) >=
              Number(fromYear)
          ) ?? [];
        setDisplayArticles(modArticles);
      }
    } else if (!fromYear && toYear) {
      if (validateYear(toYear)) {
        modArticles =
          modArticles.filter(
            (art) =>
              Number((art.publishedAt as string).split(' ')[3]) <=
              Number(toYear)
          ) ?? [];
        setDisplayArticles(modArticles);
      }
    }
  };

  const validateYear = (year: string): boolean => {
    if (Number(year) < 2000 || Number(year) > 2050) {
      toast.error('Year value too small or large');
      return false;
    }
    return true;
  };

  useEffect(() => {
    setDisplayArticles(publishedArticles);
  }, [publishedArticles]);

  useEffect(() => {
    const newArr: number[] = new Array(
      Math.ceil(displayArticles.length / displayLimit.current)
    ).fill(0);
    setPageArray(newArr);
  }, [displayArticles]);

  useEffect(() => {
    let modArticles = publishedArticles;

    modArticles =
      modArticles.filter((art) => art.title.includes(searchValue)) ?? [];

    setDisplayArticles(modArticles);
  }, [searchValue, publishedArticles]);

  useEffect(() => {
    const startPoint = (currentPageNumber - 1) * displayLimit.current;
    const endPoint = startPoint + displayLimit.current + 1;

    let modArticles = displayArticles;

    switch (sort) {
      case 'title':
        modArticles = [...modArticles].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;
      case 'volume':
        let placeholder: ArticleInfoInt[] = [];
        for (let i = 1; i <= volCount; i++) {
          placeholder.push(...modArticles.filter((art) => art.vol === i)!);
        }
        modArticles = placeholder;

        break;
      default:
        return;
    }

    switch (order) {
      case 'asc':
        modArticles = modArticles;
        break;
      case 'desc':
        modArticles = modArticles.reverse();
        break;
      default:
        return;
    }

    setCurrentPageArticles(modArticles.slice(startPoint, endPoint));
  }, [currentPageNumber, sort, order, displayArticles]);

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
              placeholder='Search title here'
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
              <h3 className='heading'>By Year</h3>

              <div className='date_range_wrapper'>
                <div className='from_wrapper'>
                  <h3>From</h3>
                  <input
                    type='number'
                    id='date_from'
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                  />
                </div>
                <div className='to_wrapper'>
                  <h3>To</h3>
                  <input
                    type='number'
                    value={toYear}
                    onChange={(e) => setToYear(e.target.value)}
                  />
                </div>
              </div>
            </article>

            <div className='filter_btns'>
              <button className='filter_btn' onClick={handleApply}>
                Apply
              </button>
              <button className='filter_btn' onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className='right_side'>
          <header>
            <div className='result_info'>
              Showing <strong>1</strong> to{' '}
              <strong>{displayLimit.current}</strong> of{' '}
              <strong>{displayArticles.length}</strong> articles
            </div>

            <div className='sort_wrapper'>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value='title'>Sort By Title</option>
                <option value='volume'>Sort By Vol.</option>
              </select>

              <select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value='asc'>Arrange Asc.</option>
                <option value='desc'>Arrange Dsc.</option>
              </select>

              <select
                value={currentPageNumber}
                onChange={(e) => setCurrentPageNumber(Number(e.target.value))}
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
                    {art.abstract.split(' ').splice(0, 30).join(' ')}...
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
