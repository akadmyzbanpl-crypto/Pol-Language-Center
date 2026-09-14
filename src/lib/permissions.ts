import { UserRole } from '../types';

export const canAccessAdmin = (role?: UserRole): boolean => {
  return role === 'admin';
};

export const canAccessTeacher = (role?: UserRole): boolean => {
  return role === 'teacher' || role === 'admin';
};

export const canAccessStudent = (role?: UserRole): boolean => {
  return role === 'student' || role === 'teacher' || role === 'admin';
};
