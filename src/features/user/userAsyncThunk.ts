import { UserCredential } from 'firebase/auth';
import { EduJournServices } from './../../services/EduJournServices';
import { UserInfoInt } from './../../types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uploadImg } from '../../helpers/firebaseFunctions';

interface RegisterUserPayloadInt extends UserInfoInt {
  password: string;
}

const eduJournServices = new EduJournServices();

export const registerUser = createAsyncThunk<
  { userAlreadyAuth: boolean; userAlreadyReg: boolean },
  { data: RegisterUserPayloadInt; resetFields: () => void }
>('user/regUser', async (payload, thunkApi) => {
  const {
    data: { email, password },
  } = payload;
  let userAlreadyAuth = true;
  let userAlreadyReg = true;

  // TODO If you care, shift img upload to bottom

  try {
    if (payload.data.imgFile) {
      payload.data.imgUrl = await uploadImg(
        payload.data.imgFile,
        payload.data.id
      );
    }
    const userInfo = await eduJournServices.isUserRegistered(email); //* Checks if email is linked to any account
    if (!userInfo.size) {
      await eduJournServices.EPSignUp(email, password);
      await eduJournServices.logOut();
      userAlreadyAuth = false;
    }

    if (!userInfo.docs.find((doc) => doc.data().role === payload.data.role)) {
      await eduJournServices.setUserInfo(payload.data);
      userAlreadyReg = false;
    }
    payload.resetFields();
    return { userAlreadyAuth, userAlreadyReg };
  } catch (error) {
    return thunkApi.rejectWithValue(`Registration error: ${error}`);
  }
});

export const signInUser = createAsyncThunk<
  UserInfoInt,
  { email: string; password: string; role: string }
>('user/signinUser', async (payload, thunkApi) => {
  try {
    await eduJournServices.EPSignIn(payload.email, payload.password);
    const userInfo = await eduJournServices.getLoggedInUserInfo(
      payload.email,
      payload.role
    );

    if (userInfo.size === 0) throw new Error('Account does not exist');
    sessionStorage.setItem('userRole', JSON.stringify(payload.role));
    return userInfo.docs[0].data() as UserInfoInt;
  } catch (error) {
    try {
      await eduJournServices.logOut();
    } catch (err) {
      console.log('Error loging out after failed login');
    }
    return thunkApi.rejectWithValue(`Signin ${error}`);
  }
});

export const getUserInfo = createAsyncThunk<UserInfoInt, { email: string }>(
  'user/userInfo',
  async (payload, thunkApi) => {
    const { email } = payload;
    try {
      const role: string = sessionStorage.getItem('userRole')
        ? JSON.parse(sessionStorage.getItem('userRole') as string)
        : '';
      const userInfo = await eduJournServices.getLoggedInUserInfo(email, role);
      return userInfo.docs[0].data() as UserInfoInt;
    } catch (error) {
      console.log('getUserInfo error');

      return thunkApi.rejectWithValue(`User fetch ${error}`);
    }
  }
);
