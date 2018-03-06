import AlertComponent from 'components/alert';
import LoaderComponent from 'components/loader';
import LoginDialog from 'components/loginDialog';
import AppRouter from 'components/router';
import AppWrapper from 'components/wrapper';
import { createMuiTheme, MuiThemeProvider, Reboot } from 'material-ui';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import { setup as setupLoaderOperator } from 'operators/loader';
import React from 'react';
import { setupLoginComponent } from 'services/auth';
import { setup as setupDialogService } from 'services/dialog';
import { setupGlobalRouter } from 'services/router';
import { baseRoutes } from 'settings';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#62727b',
      main: '#37474f',
      dark: '#102027',
      contrastText: '#fff',
    },
    secondary: {
      light: '#82c78c',
      main: '#52965e',
      dark: '#226733',
      contrastText: '#fff',
    }
  }
});

class App extends React.Component<any, { loading: boolean }> {
  alert: AlertComponent;
  loader: LoaderComponent;
  loginDialog: LoginDialog;
  refs: { router: AppRouter };

  constructor(props: any) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    setupLoginComponent(this.loginDialog);
    setupLoaderOperator(this.loader);
    setupDialogService(this.alert);

    this.setState({ loading: false }, () => {
      setupGlobalRouter(this.refs.router);
    });
  }

  render() {
    const { loading } = this.state;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          <Reboot />
          <LoginDialog innerRef={(ref: any) => this.loginDialog = ref} />
          <LoaderComponent innerRef={(ref: any) => this.loader = ref} />
          <AlertComponent innerRef={(ref: any) => this.alert = ref} />

          {!loading &&
            <AppWrapper>
              <AppRouter routes={baseRoutes} ref='router' />
            </AppWrapper>
          }
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
