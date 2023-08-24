import React, { useState } from 'react';
import DashBoardOverlayLayout from '../../layouts/DashBoardOverlayLayout';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Settings = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('');
  const [affil, setAffil] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  return (
    <DashBoardOverlayLayout type='edit profile'>
      <form className='settings_form'>
        <div className='settings_form_wrapper'>
          <div className='form_opt'>
            <input
              type='text'
              placeholder='Name (e.g Prof. Jane Doe)'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='
          Academic title (e.g Assistant Professor)'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Department'
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            />
          </div>

          <div className='form_opt'>
            <input
              type='text'
              placeholder='Affiliation'
              value={affil}
              onChange={(e) => setAffil(e.target.value)}
            />
          </div>

          <div className='form_opt'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='New password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className='pword_visible_toggle'
              onClick={() => setShowPassword(!showPassword)}
              type='button'
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <div className='form_opt'>
            <input
              placeholder='Confirm new password'
              value={conPassword}
              onChange={(e) => setConPassword(e.target.value)}
              type={showConPassword ? 'text' : 'password'}
            />
            <button
              className='pword_visible_toggle'
              onClick={() => setShowConPassword(!showConPassword)}
              type='button'
            >
              {showConPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>
        <button className='submit_btn'>Edit</button>
      </form>
    </DashBoardOverlayLayout>
  );
};

export default Settings;
