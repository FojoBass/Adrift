import React, { useState, useEffect } from 'react';
import { heroInfo } from '../../data';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroIndex(heroIndex === heroInfo.length - 1 ? 0 : heroIndex + 1);
    }, 2000);

    return () => clearInterval(heroInterval);
  }, [heroIndex]);

  return (
    <section id='hero_sect'>
      {heroInfo.map((hero, index) => (
        <article
          className='post_wrapper'
          key={index}
          style={{
            backgroundImage: `url(${hero.imgUrl})`,
            opacity: `${heroIndex === index ? '1' : '0'}`,
          }}
        >
          <div className='post_info'>
            <h2 className='title'>{hero.title}</h2>
            <p className='desc'>
              {hero.desc.split(' ').splice(0, 20).join(' ')}...
            </p>
            <Link to={`/article/${hero.id}`}>READ MORE</Link>
          </div>
        </article>
      ))}

      <div className='selector_wrapper'>
        {heroInfo.map((hero, index) => (
          <button
            key={index}
            className={`${heroIndex === index ? 'active' : ''} selector_btn`}
            onClick={() => setHeroIndex(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
