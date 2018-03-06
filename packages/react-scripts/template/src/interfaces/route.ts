export interface IAppRoute {
  path: string;
  exact: boolean;
  component: any;
  allowAnonymous?: boolean;
  roles?: string[];
}