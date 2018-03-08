import { BaseComponent, IStateBase } from 'components/base';
import DropdownMenu from 'components/dropdownMenu';
import { WithStyles } from 'decorators/withStyles';
import { IUserToken } from 'interfaces/userToken';
import { Grid, Typography } from 'material-ui';
import { ExitToApp, VpnKey } from 'material-ui-icons';
import React from 'react';
import * as authService from 'services/auth';

interface IState extends IStateBase {
  user: IUserToken;
}

interface IProps {
  closeDrawer: Function;
}

@WithStyles(theme => ({
  root: {
    textAlign: 'left',
    marginTop: '10px',
    color: theme.palette.primary.contrastText
  },
  text: {
    padding: '15px 15px 0 15px'
  }
}))
export default class AppDrawerUser extends BaseComponent<IState, IProps> {
  componentWillMount() {
    authService.getUser()
      .logError()
      .bindComponent(this)
      .subscribe(user => this.setState({ user }));
  }

  logoff() {
    this.props.closeDrawer();

    authService.logoff().subscribe(() => {
      this.router.reload();
    });
  }

  render() {
    let { user } = this.state;
    const { classes } = this.props;

    user = user || {} as any;

    return (
      <Grid container className={classes.root} wrap='nowrap'>
        <Grid item xs={true} >
          <Typography variant='body2' color='inherit' className={classes.text}>
            {user.firstName}
          </Typography>
        </Grid>
        <Grid item>
          <DropdownMenu options={[{
            text: 'Trocar senha',
            icon: <VpnKey />,
            handler: () => { }
          }, {
            text: 'Sair',
            icon: <ExitToApp />,
            handler: this.logoff.bind(this)
          }]} />
        </Grid>
      </Grid>
    );
  }
}