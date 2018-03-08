import { IAppRoute } from 'interfaces/route';
import { Dashboard as DashboardIcon, People as PeopleIcon } from 'material-ui-icons';
import DashboardIndexPage from 'pages/dashboard';
import UserIndexPage from 'pages/user';
import UserListPage from 'pages/user/list';

const baseRoutes: IAppRoute[] = [
  {
    path: '/',
    display: 'Dashboard',
    icon: DashboardIcon,
    exact: true,
    component: DashboardIndexPage,
    roles: []
  },
  {
    path: '/user',
    display: 'Usuários',
    icon: PeopleIcon,
    exact: true,
    component: UserIndexPage,
    roles: ['admin'],
    subRoutes: [{
      path: '/',
      component: UserListPage
    }]
  }
];

export default baseRoutes;