import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/store';
import { googleSignIn } from '../../features/user/userAsyncThunk';
import { EduJournServices } from '../../services/EduJournServices';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firbase_config';

interface AuthFormsLayoutPropInt {
  children: React.ReactNode;
  sectTitle: string;
  sectId: string;
  submitText: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AuthFormsLayout: React.FC<AuthFormsLayoutPropInt> = ({
  children,
  sectTitle,
  sectId,
  submitText,
  handleSubmit,
}) => {
  const { isSignupLoading, isLogInLoading } = useAppSelector(
    (state) => state.user
  );

  const dispatch = useAppDispatch();

  const handleGoogleSignup = async () => {
    dispatch(googleSignIn());
  };

  return (
    <section id={sectId} className='auth_sect'>
      <div className='auth_sect_wrapper'>
        <h3 className='auth_heading'>
          {sectTitle}
          <Link to='/' className='home_btn'>
            <AiOutlineHome />
          </Link>
        </h3>

        <form className='login_form auth_form' onSubmit={handleSubmit}>
          {children}
          <button
            className='auth_submit_btn'
            disabled={isSignupLoading || isLogInLoading}
            style={
              isSignupLoading || isLogInLoading
                ? { opacity: '0.5', cursor: 'not-allowed' }
                : {}
            }
          >
            {isSignupLoading || isLogInLoading
              ? submitText === 'Signup'
                ? 'Siging up...'
                : 'Loging in...'
              : submitText}
          </button>
        </form>

        {sectId === 'signup' && (
          <>
            <p className='some_text'>
              <span>or login with</span>
            </p>

            <button
              className='opt_btn'
              disabled={isSignupLoading || isLogInLoading}
              style={
                isSignupLoading || isLogInLoading ? { opacity: '0.5' } : {}
              }
              onClick={handleGoogleSignup}
            >
              <span>G</span>oogle
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default AuthFormsLayout;
