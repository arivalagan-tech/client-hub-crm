/**
 * Client Hub CRM - Universal Accessible Popup Controller
 */

export class SaaSPopup {
  /**
   * Creates a popup controller instance.
   * @param {string} modalId The DOM ID of the modal dialog box
   * @param {string} overlayId The DOM ID of the screen backdrop overlay
   */
  constructor(modalId, overlayId) {
    this.modal = document.getElementById(modalId);
    this.overlay = document.getElementById(overlayId);
    this.triggerElement = null; // Keeps track of element that opened the popup to restore focus
    this.onSubmitCallback = null;

    if (!this.modal || !this.overlay) {
      console.warn(`SaaSPopup: Modal or Overlay element not found for ID: ${modalId}`);
    }

    // Bind common listeners
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.close = this.close.bind(this);
  }

  /**
   * Opens the popup modal dialog.
   * @param {HTMLElement} triggerBtn The button that triggered the opening (for focus management)
   * @param {Function} onSubmitCallback Code execution after form is successfully submitted
   */
  open(triggerBtn = null, onSubmitCallback = null) {
    if (!this.modal || !this.overlay) return;

    this.triggerElement = triggerBtn || document.activeElement;
    this.onSubmitCallback = onSubmitCallback;

    // Show popup elements
    this.overlay.style.display = "block";
    this.modal.style.display = "block";

    // Set accessibility attributes
    this.overlay.setAttribute("aria-hidden", "false");
    this.modal.setAttribute("aria-hidden", "false");

    // Add keyboard hook for ESC and focus trapping
    document.addEventListener("keydown", this.handleKeyDown);

    // Auto-focus on first interactive element (usually first input or textarea)
    setTimeout(() => {
      const firstInput = this.modal.querySelector("input, textarea, select, button");
      if (firstInput) firstInput.focus();
    }, 50);

    // Bind cancel/close buttons
    const cancelBtns = this.modal.querySelectorAll(".popup-btn.secondary, .close-popup-btn");
    cancelBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        this.close();
      };
    });

    // Backdrop click-to-close handler
    this.overlay.onclick = () => this.close();
  }

  /**
   * Closes the popup modal dialog.
   */
  close() {
    if (!this.modal || !this.overlay) return;

    this.overlay.style.display = "none";
    this.modal.style.display = "none";

    // Set accessibility attributes
    this.overlay.setAttribute("aria-hidden", "true");
    this.modal.setAttribute("aria-hidden", "true");

    // Unbind keyboard hook
    document.removeEventListener("keydown", this.handleKeyDown);

    // Restore focus to the initiating element
    if (this.triggerElement && typeof this.triggerElement.focus === "function") {
      this.triggerElement.focus();
    }
  }

  /**
   * Handles keyboard shortcuts (ESC key and keyboard tab focus trapping).
   * @param {KeyboardEvent} e Key down event
   */
  handleKeyDown(e) {
    // 1. Close on ESC key
    if (e.key === "Escape") {
      this.close();
      return;
    }

    // 2. Tab key focus trapping
    if (e.key === "Tab") {
      const focusableSelectors = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex=\"0\"], [contenteditable]";
      const focusableElements = Array.from(this.modal.querySelectorAll(focusableSelectors));
      
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (backward navigation)
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab (forward navigation)
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }
}
