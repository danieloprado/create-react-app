import { IUserToken } from 'interfaces/userToken';
import * as raven from 'raven-js';
import { ENV, isDevelopment, SENTRY_KEY } from 'settings';

let ravenSetup = false;

if (SENTRY_KEY && !isDevelopment) {
  raven.config(SENTRY_KEY, {
    environment: ENV,
    tags: { environment: ENV }
  }).install();

  raven.setShouldSendCallback(() => {
    let err: any = raven.lastException();
    if (!err || err.ignoreLog) return false;

    if (typeof err === 'string') {
      err = new Error(err);
    }

    return true;
  });

  ravenSetup = true;
}

export function setUser(user: IUserToken): void {
  ravenSetup && raven.setUserContext(!user ? null : {
    id: user.id,
    name: user.fullName,
    email: user.email,
    roles: user.roles.join()
  });
}

export function breadcrumb(message: string, category: string = 'manual', data: any = {}): void {
  if (isDevelopment) console.log('breadcrumb: ' + category + ' - ' + message, data);

  data = data || {};
  delete data.type;

  ravenSetup && raven.captureBreadcrumb({ message, category, data });
}

export function handleError(err: any, force: boolean = false): void {
  if (isDevelopment) {
    console.error(err);
    console.log(err.metadata);
    return;
  }

  ravenSetup && raven.captureException(err);
}