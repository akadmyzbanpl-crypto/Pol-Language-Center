import { User, UserRole } from '../types';
import { store } from './storeService';
import { auth, db, isFirebaseConfigured } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const authService = {
  async registerUser(data: {
    firstName: string;
    lastName: string;
    username: string;
    phone: string;
    email: string;
    password: string;
  }): Promise<User> {
    // 1. Check username uniqueness
    const existingUsername = store.findUserByUsername(data.username);
    if (existingUsername) {
      throw new Error('این نام کاربری قبلاً استفاده شده است');
    }

    // 2. Check email uniqueness
    const existingEmail = store.findUserByEmail(data.email);
    if (existingEmail) {
      throw new Error('این ایمیل قبلاً ثبت نام کرده است');
    }

    const uid = 'user_' + Date.now();
    const newUser: User = {
      uid,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      phone: data.phone,
      email: data.email,
      role: 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // Firebase Auth attempt if configured
    if (isFirebaseConfigured && auth && db) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
        newUser.uid = userCred.user.uid;
        await setDoc(doc(db, 'users', newUser.uid), newUser);
      } catch (err: any) {
        console.warn('Firebase register error (using local storage):', err.message);
      }
    }

    store.saveUser(newUser);
    return newUser;
  },

  async loginUser(identifier: string, password: string): Promise<User> {
    // Lookup by username or email
    let user = store.findUserByUsername(identifier);
    if (!user) {
      user = store.findUserByEmail(identifier);
    }

    if (!user) {
      throw new Error('کاربری با این مشخصات یافت نشد');
    }

    if (!user.isActive) {
      throw new Error('حساب کاربری شما مسدود یا غیرفعال شده است');
    }

    // For demo/offline: check default demo password or Firebase
    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, user.email, password);
      } catch (e: any) {
        // Fallback for demo users if Firebase fails
        if (password !== '123456') {
          throw new Error('رمز عبور وارد شده نادرست است');
        }
      }
    } else {
      if (password !== '123456' && password.length < 6) {
        throw new Error('رمز عبور وارد شده نادرست است');
      }
    }

    return user;
  },

  async logoutUser(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
  },

  async resetPassword(email: string): Promise<void> {
    const user = store.findUserByEmail(email);
    if (!user) {
      throw new Error('حسابی با این ایمیل یافت نشد');
    }
  },

  getCurrentUserProfile(uid: string): User | undefined {
    return store.findUserById(uid);
  },

  listUsers(): User[] {
    return store.getUsers();
  },

  updateUser(uid: string, updates: Partial<User>): User {
    const user = store.findUserById(uid);
    if (!user) throw new Error('کاربر یافت نشد');
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    store.saveUser(updated);
    return updated;
  },

  createUserAdmin(data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone?: string;
    role: UserRole;
    status?: 'active' | 'inactive' | 'suspended';
  }): User {
    const newUser: User = {
      uid: 'user_' + Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      phone: data.phone || '',
      email: data.email,
      role: data.role,
      status: data.status || 'active',
      isActive: data.status !== 'inactive' && data.status !== 'suspended',
      createdAt: new Date().toISOString(),
    };
    store.saveUser(newUser);
    return newUser;
  },

  deleteUser(uid: string): void {
    store.deleteUser(uid);
  },
};

