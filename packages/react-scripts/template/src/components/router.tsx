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

  public reload(): void {
    /* Hack for reload, dont judge me: https://github.com/ReactTraining/react-router/issues/1982 */
    const path = this.history.location.pathname;
    this.history.replace('/reload');
    setTimeout(() => this.history.replace(path));
  }

  public navigate(path: string): void {
    if (path === this.history.location.pathname) {
      this.reload();
      return;
    }

    this.history.push(path);
  }

  public render(): JSX.Element {
    const { routes } = this.props;

    return (
      <BrowserRouter ref='browserRouter'>
        <Switch>
          {routes.map(this.renderRoute.bind(this))}
          <Route path='/reload' exact render={() => <div></div>} />
          <Route render={() => <Redirect to='/' />} />
        </Switch>
      </BrowserRouter>
    );
  }

  public renderRoute(route: IAppRoute, index: number): JSX.Element {
    return (
      <Route key={index} exact={route.exact} path={route.path}
        render={props => route.allowAnonymous ?
          <route.component {...props}>
            {(route.subRoutes || []).map(this.renderRoute.bind(this))}
          </route.component> :
          <AppRouterProtected route={route} routeProps={props}>
            {(route.subRoutes || []).map(this.renderRoute.bind(this))}
          </AppRouterProtected>
        } />
    );
  }

}
