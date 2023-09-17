import React from 'react';
import { useGlobalContext } from '../../context';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { navLinks } from '../../data';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/store';

const SideNav = () => {
  const { isOpenSide, setIsOpenSide } = useGlobalContext();

  return (
    <section
      id='side_nav'
      className={isOpenSide ? 'active' : ''}
      onClick={(e) =>
        e.target === e.currentTarget && setIsOpenSide && setIsOpenSide(false)
      }
    >
      <aside className={`nav_sect ${isOpenSide ? 'active' : ''}`}>
        <div className='top_wrapper'>
          <button
            className='close_menu_btn'
            onClick={() => setIsOpenSide && setIsOpenSide(false)}
          >
            <AiOutlineMenuUnfold />
          </button>

          <span className='logo'>
            AD<span>RI</span>FT
          </span>
        </div>

        <div className='nav_link_wrapper'>
          {navLinks.map(({ url, title }, index) => (
            <NavLink
              key={index}
              to={url}
              className={`nav_link ${
                title === 'Login/Signup' ? 'login_btn' : ''
              }`}
            >
              {title}
            </NavLink>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default SideNav;
