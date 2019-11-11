import { users, roles , user_roles} from './users.entity';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: users,
  },
];

export const rolesProviders = [
  {
    provide: 'ROLES_REPOSITORY',
    useValue: roles,
  },
];

export const usersrolesProviders = [
  {
    provide: 'USER_ROLES_REPO',
    useValue: user_roles,
  },
];