import { BaseComponent, IStateBase } from 'components/base';
import AppRouterProtected from 'components/routerProtected';
import { History } from 'history';
import { IAppRoute } from 'interfaces/route';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

interface IState extends IStateBase {
  loaded: boolean;
}

interface IProps {
  routes: IAppRoute[];
}

interface IRefs {
  browserRouter: RouteComponentProps<any>;
}

export default class AppRouter extends BaseComponent<IState, IProps, IRefs> {
  get history(): History {
    return this.refs.browserRouter.history;
  }

  public navigate(path: string): void {
    if (path === this.history.location.pathname) {
      window.location.reload();
      return;
    }

    this.history.push(path);
  }

  public render(): JSX.Element {
    const { routes } = this.props;

    return (
      <BrowserRouter ref='browserRouter'>
        <Switch>
          {routes.map((route, index) =>
            <Route key={index} exact={route.exact} path={route.path} render={props => {
              if (route.allowAnonymous) {
                return <route.component {...props} />;
              }

              return <AppRouterProtected route={route} routeProps={props} />;
            }} />
          )}
          <Route render={() => <Redirect to='/' />} />
        </Switch>
      </BrowserRouter>
    );
  }
}
