import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <section id='error_sect'>
      <div className='error_wrapper'>
        <h1>
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </h1>
        <h2>Page not found!</h2>
        <Link to='/' className='home_btn'>
          Back Home
        </Link>
      </div>
    </section>
  );
};

export default Error;
