import { BaseComponent, IStateBase } from 'components/base';
import AppDrawerUser from 'components/drawerUser';
import { WithStyles } from 'decorators/withStyles';
import { IAppRoute } from 'interfaces/route';
import { IUserToken } from 'interfaces/userToken';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from 'material-ui';
import { darken } from 'material-ui/styles/colorManipulator';
import React from 'react';
import baseRoutes from 'routes';
import * as authService from 'services/auth';

interface IState extends IStateBase {
  user?: IUserToken;
  routes: IAppRoute[];
}

interface IProps {
  closeDrawer: Function;
}

@WithStyles(theme => ({
  root: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: '100vh'
  },
  header: {
    padding: '10px 0',
    textAlign: 'center',
    background: darken(theme.palette.primary.main, 0.15)
  },
  logo: {
    maxWidth: '100px',
    maxHeight: '100px'
  },
  icon: {
    margin: '0'
  },
  text: {
    color: 'inherit'
  }
}))
export default class AppDrawer extends BaseComponent<IState, IProps> {

  constructor(props: any) {
    super(props);
    this.state = { routes: [] };
  }

  componentWillMount() {
    authService.getUser()
      .logError()
      .bindComponent(this)
      .subscribe(user => {
        const routes = !user ? [] :
          baseRoutes.filter(route => user.canAccess(...route.roles));

        this.setState({ user, routes });
      });
  }

  toRoute(route: IAppRoute) {
    this.props.closeDrawer();
    this.router.navigate(route.path);
  }

  render() {
    const { routes, user } = this.state;
    const { classes, closeDrawer } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <img src={require('assets/logo.png')} className={classes.logo} />
          {!!user &&
            <Typography variant='subheading' color='inherit'>
              {user.church.name}
            </Typography>
          }

          <AppDrawerUser closeDrawer={closeDrawer} />
        </div>

        <List>
          {routes.map((route, index) =>
            <ListItem button key={index} onClick={this.toRoute.bind(this, route)}>
              {!!route.icon &&
                <ListItemIcon className={classes.icon} classes={{ root: classes.text }}>
                  <route.icon />
                </ListItemIcon>
              }
              <ListItemText primary={route.display} classes={{ primary: classes.text }} />
            </ListItem>
          )}
        </List>
      </div>
    );
  }
}