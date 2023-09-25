import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import AuthFormsLayout from './layouts/AuthFormsLayout';
import { useGlobalContext } from '../context';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../app/store';
import { userSlice } from '../features/user/userSlice';
import { forgotPword, signInUser } from '../features/user/userAsyncThunk';
import { validateEmail } from '../helpers/formHandling';
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs';

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
  const [isForgot, setIsForgot] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const { setIsDemo, isDemo } = useGlobalContext();

  const demoRef = useRef<HTMLDivElement | null>(null);
  const demoContainerRef = useRef<HTMLDivElement | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) toast.info('All fields are required');
    else dispatch(signInUser({ email: email.toLowerCase(), password, role }));
  };

  const handleDemo = (role: string) => {
    if (isLoggedIn) toast.info('An account is already logged in');
    else {
      setEmail(
        process.env.REACT_APP_DEMO_EMAIL ? process.env.REACT_APP_DEMO_EMAIL : ''
      );
      setPassword(
        process.env.REACT_APP_DEMO_PASSWORD
          ? process.env.REACT_APP_DEMO_PASSWORD
          : ''
      );
      setRole(role);
      setIsDemoOpen(false);
      setIsDemo && setIsDemo(true);
    }
  };

  useEffect(() => {
    if (isDemo && !isLoggedIn) {
      dispatch(signInUser({ email: email.toLowerCase(), password, role }));
    }
  }, [isLoggedIn, isDemo, email, password, role]);

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
      appError.includes('wrong-password') ||
      appError.includes('invalid-login-credentials')
    )
      toast.error('Incorrect email or password');
    if (appError.includes('Account does not exist'))
      toast.error('Account does not exist');
    if (appError.includes('network-request-failed'))
      toast.error('Check network connection and try again');

    dispatch(resetAuthError(''));
  }, [appError]);

  useEffect(() => {
    if (demoRef.current && demoContainerRef.current) {
      const el = demoRef.current;
      const elContainer = demoContainerRef.current;

      if (isDemoOpen)
        elContainer.style.height = el.getBoundingClientRect().height + 5 + 'px';
      else elContainer.style.height = '0px';
    }
  }, [isDemoOpen, demoRef, demoContainerRef]);

  return (
    <>
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
          <button
            className='forgot_btn bottom_part_btn'
            type='button'
            onClick={() => setIsForgot(true)}
          >
            Forgot password?
          </button>
        </div>

        <div className='select_wrapper'>
          <select
            className='login_opts'
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value='author'>Author</option>
            <option value='editor'>Editor</option>
            <option value='reviewer'>Reviewer</option>
            <option value='admin'>Admin</option>
          </select>

          <div className='demo_opts'>
            <button
              type='button'
              className='demo_btn'
              onClick={() => setIsDemoOpen(!isDemoOpen)}
            >
              Demo {isDemoOpen ? <BsCaretUpFill /> : <BsCaretDownFill />}
            </button>

            <div className='demo_opts_super_wrapper' ref={demoContainerRef}>
              <div className='demo_opts_wrapper' ref={demoRef}>
                <button
                  type='button'
                  className='demo_opt'
                  onClick={() => handleDemo('author')}
                >
                  Author
                </button>
                <button
                  type='button'
                  className='demo_opt'
                  onClick={() => handleDemo('editor')}
                >
                  Editor
                </button>
                <button
                  type='button'
                  className='demo_opt'
                  onClick={() => handleDemo('reviewer')}
                >
                  Reviewer
                </button>
                <button
                  type='button'
                  className='demo_opt'
                  onClick={() => handleDemo('admin')}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </AuthFormsLayout>

      {isForgot && <ForgotPass setIsForgot={setIsForgot} />}
    </>
  );
};

export default Login;

interface ForgotPassInt {
  setIsForgot: React.Dispatch<React.SetStateAction<boolean>>;
}

const ForgotPass: React.FC<ForgotPassInt> = ({ setIsForgot }) => {
  const [email, setEmail] = useState('');
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const { isRequestingFailed, justRequested } = useAppSelector(
    (state) => state.user
  );
  const { resetJustRequested, resetIsRequestingFailed } = userSlice.actions;
  const dispatch = useAppDispatch();

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email, emailInputRef.current)) {
      dispatch(forgotPword({ email }));
    }
  };

  const handleClose = () => {
    setIsForgot(false);
  };

  useEffect(() => {
    if (isRequestingFailed) {
      toast.error('Request failed!');
      dispatch(resetIsRequestingFailed(''));
    }

    if (justRequested) {
      toast.success('Password reset link sent to mail');
      dispatch(resetJustRequested(''));
      handleClose();
    }
  }, [isRequestingFailed, justRequested]);

  return (
    <section id='forgot_sect'>
      <AuthFormsLayout
        sectTitle='Forgot Password'
        sectId='forgot'
        submitText='Request'
        handleSubmit={handleRequest}
        closeSect={handleClose}
      >
        <div className='form_opt'>
          <input
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef}
          />
        </div>
      </AuthFormsLayout>
    </section>
  );
};
