/**
 * CardSphere India - AuthService
 * Manages user registration, login, logout, and session persistence in localStorage.
 * Minimalist schema: strictly username and password.
 */

const STORAGE_KEYS = {
  USERS: 'cardsphere_users',
  CURRENT_USER: 'cardsphere_current_user'
};

export class AuthService {
  static getStorage(key, defaultValue = null) {
    try {
      if (typeof localStorage === 'undefined') {
        if (!globalThis._mockStorage) globalThis._mockStorage = {};
        return globalThis._mockStorage[key] !== undefined ? JSON.parse(globalThis._mockStorage[key]) : defaultValue;
      }
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`AuthService read error for ${key}:`, e);
      return defaultValue;
    }
  }

  static setStorage(key, value) {
    try {
      if (typeof localStorage === 'undefined') {
        if (!globalThis._mockStorage) globalThis._mockStorage = {};
        globalThis._mockStorage[key] = JSON.stringify(value);
        return;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`AuthService write error for ${key}:`, e);
    }
  }

  /**
   * Retrieves all registered accounts.
   * Auto-seeds a demo account if none exists.
   */
  static getUsers() {
    let users = this.getStorage(STORAGE_KEYS.USERS, null);
    if (!users) {
      users = {
        'demo_user': {
          username: 'demo_user',
          password: 'cardsphere123',
          createdAt: '2026-01-01T00:00:00.000Z'
        }
      };
      this.setStorage(STORAGE_KEYS.USERS, users);
    }
    return users;
  }

  /**
   * Register a new user with strictly username and password.
   * @param {string} username 
   * @param {string} password 
   * @returns {{ success: boolean, message: string, user?: object }}
   */
  static signup(username, password) {
    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername) {
      return { success: false, message: 'Username is required.' };
    }
    if (cleanUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters long.' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      return { success: false, message: 'Username can only contain letters, numbers, underscores, and hyphens.' };
    }
    if (!cleanPassword) {
      return { success: false, message: 'Password is required.' };
    }
    if (cleanPassword.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const users = this.getUsers();
    const key = cleanUsername.toLowerCase();

    if (users[key]) {
      return { success: false, message: `Username "${cleanUsername}" is already taken.` };
    }

    const newUser = {
      username: cleanUsername,
      password: cleanPassword,
      createdAt: new Date().toISOString()
    };

    users[key] = newUser;
    this.setStorage(STORAGE_KEYS.USERS, users);

    // Auto log in newly signed up user
    const sessionUser = {
      username: newUser.username,
      loggedInAt: new Date().toISOString()
    };
    this.setStorage(STORAGE_KEYS.CURRENT_USER, sessionUser);
    this.dispatchAuthEvent(sessionUser);

    return {
      success: true,
      message: `Account created successfully! Welcome, ${cleanUsername}.`,
      user: sessionUser
    };
  }

  /**
   * Log in an existing user with username and password.
   * @param {string} username 
   * @param {string} password 
   * @returns {{ success: boolean, message: string, user?: object }}
   */
  static login(username, password) {
    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername || !cleanPassword) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    const users = this.getUsers();
    const key = cleanUsername.toLowerCase();
    const user = users[key];

    if (!user) {
      return { success: false, message: 'No account found with this username.' };
    }

    if (user.password !== cleanPassword) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const sessionUser = {
      username: user.username,
      loggedInAt: new Date().toISOString()
    };
    this.setStorage(STORAGE_KEYS.CURRENT_USER, sessionUser);
    this.dispatchAuthEvent(sessionUser);

    return {
      success: true,
      message: `Welcome back, ${user.username}!`,
      user: sessionUser
    };
  }

  /**
   * Log out active user.
   */
  static logout() {
    try {
      if (typeof localStorage === 'undefined') {
        if (globalThis._mockStorage) delete globalThis._mockStorage[STORAGE_KEYS.CURRENT_USER];
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('AuthService logout error:', e);
    }
    this.dispatchAuthEvent(null);
  }

  /**
   * Get active logged in user or null.
   * @returns {object|null}
   */
  static getCurrentUser() {
    return this.getStorage(STORAGE_KEYS.CURRENT_USER, null);
  }

  /**
   * Check if an active user session exists.
   * @returns {boolean}
   */
  static isLoggedIn() {
    return !!this.getCurrentUser();
  }

  static dispatchAuthEvent(user) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cardsphere:auth_changed', {
        detail: { user, isLoggedIn: !!user }
      }));
    }
  }
}
