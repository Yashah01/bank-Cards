/**
 * CardSphere India - Toast Notification Manager
 */

export class Toast {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'cardsphere-toast-container';
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.container);
    }
  }

  static show(message, type = 'info', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  static success(msg, duration) { this.show(msg, 'success', duration); }
  static warning(msg, duration) { this.show(msg, 'warning', duration); }
  static error(msg, duration) { this.show(msg, 'error', duration); }
  static info(msg, duration) { this.show(msg, 'info', duration); }
}
