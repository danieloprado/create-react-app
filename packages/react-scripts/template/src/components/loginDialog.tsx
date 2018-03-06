import { BaseComponent, IStateBase } from 'components/base';
import Field from 'components/field';
import { WithStyles } from 'decorators/withStyles';
import { Button, Card, CardActions, CardContent, Dialog } from 'material-ui';
import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as authService from 'services/auth';
import { showAlertError } from 'services/dialog';
import { isDevelopment } from 'settings';
import LoginValidator, { ILoginValidatorResult } from 'validators/login';

interface IState extends IStateBase<ILoginValidatorResult> {
  opened: boolean;
}

@WithStyles(theme => ({
  root: {
    background: theme.palette.primary.main,
    minHeight: '100vh',
    minWidth: '100vw',
    position: 'relative'
  },
  container: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
    width: '300px',
    height: '500px',
    maxWidth: 'calc(100% - 30px)'
  },
  buttons: {
    justifyContent: 'space-between'
  }
}))
export default class LoginDialog extends BaseComponent<IState> {
  private result$: Subject<boolean>;

  constructor(props: any) {
    super(props);

    this.validator = new LoginValidator();

    const model = !isDevelopment ? {} :
      { email: 'danielprado.ad@gmail.com', password: 'HopeJC123' };

    this.state = { opened: false, model };
  }

  show(): Observable<boolean> {
    this.result$ = new Subject();
    this.setState({ opened: true });

    return this.result$.asObservable();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const { model: { email, password } } = this.state;

    this.isFormValid(this.validator)
      .filter(ok => ok)
      .switchMap(() => authService.login(email, password).loader())
      .logError()
      .bindComponent(this)
      .subscribe(() => {
        this.result$.next(true);
        this.result$.complete();

        this.setState({ opened: false });
      }, err => showAlertError(err).subscribe());
  }

  render() {
    const { opened, model, formSubmitted } = this.state;
    const { classes } = this.props;

    return (
      <Dialog fullScreen open={opened} >
        <div className={classes.root}>
          <form className={classes.container} onSubmit={this.onSubmit.bind(this)}>
            <Card>
              <CardContent>

                <Field
                  label='Email'
                  type='email'
                  className={classes.textField}
                  value={model.email}
                  submitted={formSubmitted}
                  error={this.getErrorMessage('email')}
                  onChange={this.updateModel(v => model.email = v)}
                  margin='none'
                />

                <Field
                  label='Senha'
                  type='password'
                  className={classes.textField}
                  value={model.password}
                  submitted={formSubmitted}
                  error={this.getErrorMessage('password')}
                  onChange={this.updateModel(v => model.password = v)}
                />

              </CardContent>

              <CardActions className={classes.buttons}>
                <Button size='small'>Recuperar Acesso</Button>
                <Button color='secondary' type='submit'>Entrar</Button>
              </CardActions>
            </Card>
          </form>
        </div>
      </Dialog>
    );
  }
}