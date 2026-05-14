export type ThemeMode = 'dark' | 'light';

export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isEmailVerified: boolean;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
