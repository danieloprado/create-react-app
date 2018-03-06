import { IUserToken } from 'interfaces/userToken';
import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as api from 'services/api';
import * as log from 'services/log';
import * as storage from 'services/storage';

const token$: ReplaySubject<string> = new ReplaySubject(1);
let loginComponent: ILoginComponent;

storage.get('access-token')
  .logError()
  .first()
  .catch(() => null)
  .subscribe(token => token$.next(token));

token$.distinctUntilChanged()
  .switchMap(token => storage.set('access-token', token))
  .logError()
  .subscribe();

getUser().distinctUntilChanged()
  .subscribe(user => log.setUser(user));

export interface ILoginComponent {
  show(): Observable<boolean>;
}

export function getAccessToken(): Observable<string> {
  return token$.asObservable();
}

export function setAccessToken(token: string): Observable<void> {
  return Observable.of(true).map(() => token$.next(token));
}

export function getUser(): Observable<IUserToken> {
  return getAccessToken().map(token => {
    if (!token) return null;

    const user = JSON.parse(atob(token.split('.')[1]));
    user.fullName = `${user.firstName} ${user.lastName}`;
    user.canAccess = (...roles: string[]) => {
      if (!roles || roles.length === 0) return true;
      if (user.roles.includes('sysAdmin') || user.roles.includes('admin')) return true;

      return roles.some(r => user.roles.includes(r));
    };

    return user;
  }).shareReplay(1);
}

export function setupLoginComponent(component: ILoginComponent) {
  loginComponent = component;
}

export function showLogin(): Observable<IUserToken> {
  return loginComponent
    .show()
    .switchMap(() => getUser());
}

export function login(email: string, password: string): Observable<void> {
  return api.post('/auth/login', { email, password });
}

export function logoff(): Observable<void> {
  return setAccessToken(null).map(() => token$.next(null));
}