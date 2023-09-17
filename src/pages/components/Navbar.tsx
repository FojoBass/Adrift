import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { navLinks } from '../../data';
import { userSlice } from '../../features/user/userSlice';
import { useAppSelector } from '../../app/store';
import { useGlobalContext } from '../../context';
import { AiOutlineMenuFold } from 'react-icons/ai';

const Navbar = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const { logOut, setIsOpenSide } = useGlobalContext();
  return (
    <nav id='nav_sect'>
      <div className='center_sect'>
        <Link to='/' className='logo_btn'>
          AD<span>RI</span>FT
        </Link>

        <div className='navlink_super_wrapper'>
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

            <NavLink
              to={isLoggedIn ? '/' : '/login'}
              className={`nav_link ${isLoggedIn ? 'logout_btn' : 'login_btn'}`}
              onClick={isLoggedIn ? () => logOut && logOut() : () => {}}
            >
              {isLoggedIn ? 'Logout' : 'Login/Signup'}
            </NavLink>
          </div>

          <NavLink
            to={isLoggedIn ? '/' : '/login'}
            className={`nav_link ${
              isLoggedIn ? 'logout_btn' : 'login_btn'
            } small`}
            onClick={isLoggedIn ? () => logOut && logOut() : () => {}}
          >
            {isLoggedIn ? 'Logout' : 'Login/Signup'}
          </NavLink>

          <button
            className='menu_btn'
            onClick={() => setIsOpenSide && setIsOpenSide(true)}
          >
            <AiOutlineMenuFold />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
