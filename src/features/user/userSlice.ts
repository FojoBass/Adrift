import { createSlice } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import {
  registerUser,
  signInUser,
  getUserInfo,
  updateUserInfo,
  updatePassWord,
} from './userAsyncThunk';
import { UserInfoInt } from '../../types';

interface IntialStateInt {
  userDetails: UserInfoInt;
  teamInfo: UserInfoInt[];
  isLogInLoading: boolean;
  isLoggedIn: boolean;
  isSignupLoading: boolean;
  isSignedUp: boolean;
  appError: string;
  isJustLoggedIn: boolean;
  userAppLoading: boolean;
  isAlreadyAuth: boolean;
  isAlreadyReg: boolean;
  isAddingTeam: boolean;
  setIsLoggedInFalse: boolean;
  updatingInfo: boolean;
  justUpdatedInfo: boolean;
  updatingFailed: boolean;
  justUpdatePassword: boolean;
  updatingPasswordFailed: boolean;
  updatingPassword: boolean;
}

const initialState: IntialStateInt = {
  userDetails: {
    id: '',
    name: '',
    title: '',
    email: '',
    affiliation: '',
    role: '',
    dept: '',
    imgUrl: '',
  },
  teamInfo: [],
  isLogInLoading: false,
  isLoggedIn: false,
  isJustLoggedIn: false,
  isSignupLoading: false,
  isSignedUp: false,
  appError: '',
  userAppLoading: true,
  isAlreadyAuth: false,
  isAlreadyReg: false,
  isAddingTeam: false,
  setIsLoggedInFalse: false, //* This is for delayed set
  updatingInfo: false,
  justUpdatedInfo: false,
  updatingFailed: false,
  justUpdatePassword: false,
  updatingPasswordFailed: false,
  updatingPassword: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsSignedUp(state, action) {
      state.isSignedUp = action.payload;
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    resetAuthError(state, action) {
      state.appError = '';
    },
    setIsJustLoggedIn(state, action) {
      state.isJustLoggedIn = action.payload;
    },
    resetIsAlreadyAuth(state, action) {
      state.isAlreadyAuth = false;
    },
    resetIsAlreadyReg(state, action) {
      state.isAlreadyReg = false;
    },
    setUserAppLoading(state, action) {
      state.userAppLoading = action.payload;
    },
    resetSetIsLoggedInFalse(state, action) {
      state.setIsLoggedInFalse = false;
    },
    setTeamInfo(state, action) {
      state.teamInfo = action.payload;
    },
    resetJustUpdated(state, action) {
      state.justUpdatedInfo = false;
    },
    resetUpdatingFailed(state, action) {
      state.updatingFailed = false;
    },
    resetUpdatingPasswordFailed(state, action) {
      state.updatingPasswordFailed = false;
    },
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    resetJustUpdatePassword(state, action) {
      state.justUpdatePassword = false;
    },
  },
  extraReducers: (builder) => {
    // *Sign up
    builder
      .addCase(registerUser.pending, (state) => {
        state.isSignupLoading = true;
        state.isAddingTeam = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isSignupLoading = false;
        state.isSignedUp = true;
        state.isAlreadyAuth = action.payload.userAlreadyAuth;
        state.isAlreadyReg = action.payload.userAlreadyReg;
        state.isAddingTeam = false;
        if (!action.payload.userAlreadyAuth) state.setIsLoggedInFalse = true;
      })
      .addCase(registerUser.rejected, (state, error) => {
        state.isSignupLoading = false;
        state.isAddingTeam = false;
        console.log(error);
      });
    // * Log in
    builder
      .addCase(signInUser.pending, (state) => {
        state.isLogInLoading = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.userDetails = action.payload;
        state.isLogInLoading = false;
        state.isLoggedIn = true;
        state.isJustLoggedIn = true;
      })
      .addCase(signInUser.rejected, (state, error) => {
        state.isLogInLoading = false;
        state.appError = error.payload as string;
        console.log(error);
      });
    // * User Info
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.userAppLoading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.userAppLoading = false;
      })
      .addCase(getUserInfo.rejected, (state, error) => {
        state.userAppLoading = false;
        state.appError = 'App loading failed';
        console.log(error);
      });
    // *Update User
    builder
      .addCase(updateUserInfo.pending, (state) => {
        state.updatingInfo = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.justUpdatedInfo = true;
        state.updatingInfo = false;
      })
      .addCase(updateUserInfo.rejected, (state, error) => {
        console.log(error);
        state.updatingInfo = true;
      });
    // *Update Password
    builder
      .addCase(updatePassWord.pending, (state) => {
        state.updatingPassword = true;
      })
      .addCase(updatePassWord.fulfilled, (state, action) => {
        state.justUpdatePassword = true;
        state.updatingPassword = false;
      })
      .addCase(updatePassWord.rejected, (state, error) => {
        console.log(error);
        state.updatingPassword = false;
      });
  },
});

export default userSlice.reducer;
