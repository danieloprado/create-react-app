import { Observable } from 'rxjs/Observable';

let alertComponent: IAlertComponent;

export interface IAlertComponent {
  show(message: string, title: string, confirmation?: boolean): Observable<boolean>;
}

export function setup(compoent: IAlertComponent): void {
  alertComponent = compoent;
}

export function showAlert(message: string, title: string = 'Atenção'): Observable<boolean> {
  return Observable
    .of(true)
    .switchMap(() => alertComponent.show(message, title, false));
}

export function showAlertError(err: any): Observable<boolean> {
  let message;
  const status: any = {
    '-1': 'Servidor não encontrado',
    400: 'Dados inválidos',
    401: 'Sem permissão de acesso',
    403: 'Sem permissão de acesso',
    422: 'Dados inválidos'
  };

  switch ((err || {}).message) {
    case 'no-internet':
    case 'NETWORK_ERROR':
      message = 'Sem conexão com a internet';
      break;
    case 'api-error':
      if (err.status == -1) {
        message = 'Não conseguimos se comunicar com o servidor';
        break;
      }

      message = status[err.status] || 'Algo deu errado...';
      break;
    default:
      message = 'Algo deu errado...';
  }

  return showAlert(message);
}

export function showConfirm(message: string, title: string = 'Confirmação'): Observable<boolean> {
  return Observable
    .of(true)
    .switchMap(() => alertComponent.show(message, title, true));
}