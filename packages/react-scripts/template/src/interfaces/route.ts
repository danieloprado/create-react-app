import { SvgIconProps } from 'material-ui/SvgIcon';
import { ComponentType } from 'react';

export interface IAppRoute {
  path: string;
  exact?: boolean;
  component: any;
  allowAnonymous?: boolean;
  display?: string;
  icon?: ComponentType<SvgIconProps>;
  roles?: string[];
  subRoutes?: IAppRoute[];
}