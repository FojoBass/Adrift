import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import AuthFormsLayout from './layouts/AuthFormsLayout';
import { useGlobalContext } from '../context';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../app/store';
import { userSlice } from '../features/user/userSlice';
import { signInUser } from '../features/user/userAsyncThunk';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { userDetails, isLoggedIn, isJustLoggedIn, appError } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();
  const { setIsSignedUp, resetAuthError, setIsJustLoggedIn } =
    userSlice.actions;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('author');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) toast.info('All fields are required');
    else dispatch(signInUser({ email: email.toLowerCase(), password, role }));
  };

  useEffect(() => {
    dispatch(setIsSignedUp(false));
  }, []);

  useEffect(() => {
    if (isJustLoggedIn && userDetails.id) {
      if (userDetails.role === 'author')
        navigate(`/submissions/author/${userDetails.id}`);
      else navigate(`/dashboard/${role}/${userDetails.id}`);
      dispatch(setIsJustLoggedIn(false));
    }
  }, [isJustLoggedIn, userDetails]);

  useEffect(() => {
    if (
      appError.includes('user-not-found') ||
      appError.includes('wrong-password')
    )
      toast.error('Incorrect email or password');
    if (appError.includes('Account does not exist'))
      toast.error('Account does not exist');

    dispatch(resetAuthError(''));
  }, [appError]);

  return (
    <AuthFormsLayout
      sectId={'login_sect'}
      sectTitle={'Login'}
      submitText={'Login'}
      handleSubmit={handleLoginSubmit}
    >
      <div className='form_opt'>
        <input
          type='email'
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='form_opt'>
        <input
          type={`${showPassword ? 'text' : 'password'}`}
          placeholder='Enter password'
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

      <div className='add_action_part'>
        <Link to='/signup' className='bottom_part_btn'>
          Create author's account
        </Link>
        <button className='forgot_btn bottom_part_btn' type='button'>
          Forgot password?
        </button>
      </div>
      <select
        className='login_opts'
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value='author'>Login as Author</option>
        <option value='editor'>Login in as Editor</option>
        <option value='reviewer'>Login as Reviewer</option>
        <option value='admin'>Login as Admin</option>
      </select>
    </AuthFormsLayout>
  );
};

export default Login;
