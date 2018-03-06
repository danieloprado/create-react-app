export interface IUserToken {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  roles: string[];

  canAccess(...roles: string[]): boolean;
}