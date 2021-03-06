import { post } from 'api';
import { logError } from 'errorHandler';
import { IAppDispatcher } from 'store/interfaces';

import { typeAppStoreAuthActions } from '../reducers/auth';

export function openLoginDialog() {
  return (dispatch: IAppDispatcher<typeAppStoreAuthActions>) => {
    dispatch({ type: 'OPEN_LOGIN_DIALOG' });
  };
}

export function requestLogin<T>(username: T, password: string) {
  return async (dispatch: IAppDispatcher<typeAppStoreAuthActions>) => {
    try {
      dispatch({ type: 'REQUEST_LOGIN' });

      const { data } = await post('/oauth/token', { username, password });
      const user = JSON.parse(atob(data.token.split('.')[1]));

      dispatch({ type: 'RECEIVE_LOGIN', token: data.token, user });
    } catch (error) {
      logError(error);
      dispatch({ type: 'RECEIVE_LOGIN_ERROR', error });
    }
  };
}

export function logout() {
  return async (dispatch: IAppDispatcher<typeAppStoreAuthActions>) => {
    dispatch({ type: 'LOGOUT' });
  };
}

export function clearLoginError() {
  return async (dispatch: IAppDispatcher<typeAppStoreAuthActions>) => {
    dispatch({ type: 'RECEIVE_LOGIN_ERROR', error: null });
  };
}