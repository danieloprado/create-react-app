import { BaseComponent, IStateBase } from 'components/base';
import { IAppRoute } from 'interfaces/route';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Observable } from 'rxjs/Observable';
import * as authService from 'services/auth';

interface IState extends IStateBase {
  canAccess?: boolean;
  loading: boolean;
}

interface IProps {
  route: IAppRoute;
  routeProps: RouteComponentProps<any>;
}

export default class AppRouterProtected extends BaseComponent<IState, IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = { loading: true };
  }

  public componentWillMount(): void {
    authService.getUser()
      .bindComponent(this)
      .first()
      .loader()
      .switchMap(user => {
        if (user) return Observable.of(user);
        return authService.showLogin();
      })
      .logError()
      .subscribe(user => {
        const { route } = this.props;

        const canAccess = user && user.canAccess(...route.roles);
        this.setState({ loading: false, canAccess });
      });
  }

  public render(): JSX.Element {
    const { loading, canAccess } = this.state;
    const { route, routeProps } = this.props;

    if (loading) {
      return null;
    }

    if (!canAccess) {
      return <Redirect to='/' />;
    }

    return <route.component {...routeProps} />;
  }
}