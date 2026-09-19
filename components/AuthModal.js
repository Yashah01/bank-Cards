/**
 * CardSphere India - AuthModal Component
 * Immersive glassmorphic modal for user authentication.
 * Includes strictly username and password inputs, show/hide password toggle,
 * mode switching (Log In vs Sign Up), and instant demo credentials.
 */

import { AuthService } from '../services/AuthService.js';
import { Toast } from './Toast.js';

export class AuthModal {
  static modalEl = null;
  static currentMode = 'login'; // 'login' | 'signup'

  static init() {
    this.createDom();
  }

  static createDom() {
    if (document.getElementById('auth-modal')) {
      this.modalEl = document.getElementById('auth-modal');
      return;
    }

    this.modalEl = document.createElement('div');
    this.modalEl.id = 'auth-modal';
    this.modalEl.className = 'modal-backdrop auth-modal-backdrop';
    this.modalEl.setAttribute('role', 'dialog');
    this.modalEl.setAttribute('aria-modal', 'true');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.modalEl);

    // Close on backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    // Close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  static open(mode = 'login') {
    this.init();
    this.currentMode = mode === 'signup' ? 'signup' : 'login';
    this.render();
    this.modalEl.classList.add('is-open');
    this.modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus username input
    setTimeout(() => {
      const input = this.modalEl.querySelector('#auth-username');
      if (input) input.focus();
    }, 150);
  }

  static close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('is-open');
    this.modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Clear hash if it was #login or #signup
    if (window.location.hash === '#login' || window.location.hash === '#signup') {
      window.history.pushState(null, '', window.location.pathname + (window.location.search || '#home'));
    }
  }

  static render() {
    const isLogin = this.currentMode === 'login';

    this.modalEl.innerHTML = `
      <div class="modal-dialog auth-modal-dialog" role="document">
        
        <!-- Modal Top Bar with Brand & Close -->
        <div class="auth-modal-header">
          <div class="auth-brand-badge">
            <div class="auth-brand-emblem">CS</div>
            <div class="auth-brand-text">
              <span class="auth-brand-title">CardSphere <span>India</span></span>
              <span class="auth-brand-sub">${isLogin ? 'Welcome back' : 'Create your account'}</span>
            </div>
          </div>
          <button class="modal-close-btn" id="auth-close-btn" aria-label="Close modal">&times;</button>
        </div>

        <!-- Mode Toggle Tabs (Log In / Sign Up) -->
        <div class="auth-tabs-container" role="tablist">
          <button class="auth-tab-btn ${isLogin ? 'active' : ''}" 
                  id="tab-login" 
                  role="tab" 
                  aria-selected="${isLogin}">
            Log In
          </button>
          <button class="auth-tab-btn ${!isLogin ? 'active' : ''}" 
                  id="tab-signup" 
                  role="tab" 
                  aria-selected="${!isLogin}">
            Sign Up
          </button>
        </div>

        <!-- Error/Status Alert Banner -->
        <div class="auth-alert-banner hidden" id="auth-alert-banner" role="alert"></div>

        <!-- Main Form: Username & Password -->
        <form class="auth-form" id="auth-form" autocomplete="on">
          
          <!-- Username Field -->
          <div class="auth-field-group">
            <label for="auth-username" class="auth-label">Username</label>
            <div class="auth-input-wrapper">
              <span class="auth-input-icon" aria-hidden="true">👤</span>
              <input type="text" 
                     id="auth-username" 
                     name="username"
                     class="auth-input" 
                     placeholder="Enter your username" 
                     autocomplete="username" 
                     required>
            </div>
          </div>

          <!-- Password Field -->
          <div class="auth-field-group">
            <div class="auth-label-row">
              <label for="auth-password" class="auth-label">Password</label>
              ${isLogin ? '<span class="auth-label-hint">Min 4 chars</span>' : '<span class="auth-label-hint">Min 4 chars</span>'}
            </div>
            <div class="auth-input-wrapper">
              <span class="auth-input-icon" aria-hidden="true">🔒</span>
              <input type="password" 
                     id="auth-password" 
                     name="password"
                     class="auth-input" 
                     placeholder="Enter your password" 
                     autocomplete="${isLogin ? 'current-password' : 'new-password'}" 
                     required>
              <button type="button" 
                      class="auth-password-toggle" 
                      id="btn-toggle-password" 
                      title="Show or hide password" 
                      aria-label="Toggle password visibility">
                👁️
              </button>
            </div>
          </div>

          <!-- Quick Test Demo User Pill -->
          <div class="auth-demo-helper">
            <span class="demo-helper-text">Quick demo:</span>
            <button type="button" class="demo-pill-btn" id="btn-fill-demo">
              Fill <code>demo_user</code>
            </button>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary auth-submit-btn" id="auth-submit-btn">
            ${isLogin ? 'Sign In to CardSphere' : 'Create Account'}
          </button>

          <!-- Alternative Mode Switch Footer -->
          <div class="auth-footer-switch">
            <span>${isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
            <button type="button" class="auth-link-btn" id="auth-switch-mode-btn">
              ${isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>

        </form>

      </div>
    `;

    this.bindEvents();
  }

  static bindEvents() {
    // Close button
    this.modalEl.querySelector('#auth-close-btn')?.addEventListener('click', () => {
      this.close();
    });

    // Tab buttons
    this.modalEl.querySelector('#tab-login')?.addEventListener('click', () => {
      if (this.currentMode !== 'login') {
        this.currentMode = 'login';
        this.render();
      }
    });

    this.modalEl.querySelector('#tab-signup')?.addEventListener('click', () => {
      if (this.currentMode !== 'signup') {
        this.currentMode = 'signup';
        this.render();
      }
    });

    // Switch mode link in footer
    this.modalEl.querySelector('#auth-switch-mode-btn')?.addEventListener('click', () => {
      this.currentMode = this.currentMode === 'login' ? 'signup' : 'login';
      this.render();
    });

    // Password visibility toggle
    const pwdInput = this.modalEl.querySelector('#auth-password');
    const toggleBtn = this.modalEl.querySelector('#btn-toggle-password');
    if (pwdInput && toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isPwd = pwdInput.getAttribute('type') === 'password';
        pwdInput.setAttribute('type', isPwd ? 'text' : 'password');
        toggleBtn.textContent = isPwd ? '🙈' : '👁️';
        toggleBtn.setAttribute('title', isPwd ? 'Hide password' : 'Show password');
      });
    }

    // Demo fill button
    this.modalEl.querySelector('#btn-fill-demo')?.addEventListener('click', () => {
      const usernameInput = this.modalEl.querySelector('#auth-username');
      const passwordInput = this.modalEl.querySelector('#auth-password');
      if (usernameInput) usernameInput.value = 'demo_user';
      if (passwordInput) passwordInput.value = 'cardsphere123';
      this.clearAlert();
    });

    // Form submission
    const form = this.modalEl.querySelector('#auth-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  static showAlert(message, type = 'error') {
    const alert = this.modalEl.querySelector('#auth-alert-banner');
    if (alert) {
      alert.textContent = message;
      alert.className = `auth-alert-banner ${type}`;
      alert.classList.remove('hidden');
    }
  }

  static clearAlert() {
    const alert = this.modalEl.querySelector('#auth-alert-banner');
    if (alert) {
      alert.textContent = '';
      alert.className = 'auth-alert-banner hidden';
    }
  }

  static handleSubmit() {
    const usernameInput = this.modalEl.querySelector('#auth-username');
    const passwordInput = this.modalEl.querySelector('#auth-password');
    const submitBtn = this.modalEl.querySelector('#auth-submit-btn');

    const username = usernameInput?.value || '';
    const password = passwordInput?.value || '';

    this.clearAlert();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = this.currentMode === 'login' ? 'Verifying...' : 'Creating...';
    }

    setTimeout(() => {
      let result;
      if (this.currentMode === 'login') {
        result = AuthService.login(username, password);
      } else {
        result = AuthService.signup(username, password);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = this.currentMode === 'login' ? 'Sign In to CardSphere' : 'Create Account';
      }

      if (!result.success) {
        this.showAlert(result.message, 'error');
      } else {
        Toast.success(result.message);
        this.close();
      }
    }, 200);
  }
}
