/**
 * Login Page UI/UX Enhancements
 * Handles theme toggle, form validation, loading states, and accessibility
 */

class LoginEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupThemeToggle();
        this.setupFormValidation();
        this.setupFormEnhancements();
        this.setupAccessibility();
        this.setupExistingFunctionality();
    }

    // Loading Screen Management
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loginLoadingScreen');
        
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000);
        }
    }

    // Theme Toggle for Login Page
    setupThemeToggle() {
        const themeToggle = document.getElementById('loginThemeToggle');
        const body = document.body;
        
        // Check for saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        const body = document.body;
        const themeToggle = document.getElementById('loginThemeToggle');
        
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Enhanced Form Validation
    setupFormValidation() {
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('password');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', () => this.validatePhone(phoneInput));
            phoneInput.addEventListener('blur', () => this.validatePhone(phoneInput));
        }
        
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.validatePassword(passwordInput));
            passwordInput.addEventListener('blur', () => this.validatePassword(passwordInput));
        }
    }

    validatePhone(input) {
        const value = input.value.trim();
        const phoneRegex = /^01[3-9]\d{8}$/;
        
        this.clearValidation(input);
        
        if (value === '') {
            return true; // Empty is okay, required will handle it
        }
        
        if (!phoneRegex.test(value)) {
            this.showValidationError(input, 'সঠিক ফোন নম্বর লিখুন (যেমন: 01312125858)');
            return false;
        }
        
        this.showValidationSuccess(input);
        return true;
    }

    validatePassword(input) {
        const value = input.value;
        
        this.clearValidation(input);
        
        if (value === '') {
            return true; // Empty is okay, required will handle it
        }
        
        if (value.length < 6) {
            this.showValidationError(input, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
            return false;
        }
        
        this.showValidationSuccess(input);
        return true;
    }

    showValidationError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        
        const feedback = input.parentElement.querySelector('.validation-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = 'validation-feedback error show';
        }
    }

    showValidationSuccess(input) {
        input.classList.add('success');
        input.classList.remove('error');
        
        const feedback = input.parentElement.querySelector('.validation-feedback');
        if (feedback) {
            feedback.className = 'validation-feedback';
        }
    }

    clearValidation(input) {
        input.classList.remove('error', 'success');
        
        const feedback = input.parentElement.querySelector('.validation-feedback');
        if (feedback) {
            feedback.className = 'validation-feedback';
        }
    }

    // Form Enhancement Features
    setupFormEnhancements() {
        const form = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginButton');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validate all fields
                const phoneValid = this.validatePhone(document.getElementById('phone'));
                const passwordValid = this.validatePassword(document.getElementById('password'));
                
                if (phoneValid && passwordValid) {
                    this.handleLogin(e);
                } else {
                    this.showError('অনুগ্রহ করে সকল ক্ষেত্র সঠিকভাবে পূরণ করুন।');
                }
            });
        }
        
        // Auto-format phone number
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                e.target.value = value;
            });
        }
    }

    handleLogin(e) {
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        const loginBtn = document.getElementById('loginButton');
        
        // Show loading state
        this.setLoadingState(loginBtn, true);
        
        // Simulate network delay for better UX
        setTimeout(() => {
            // Validate credentials
            if (phone === '01312125858' && password === 'rjSHAKIB717273') {
                // Store login state
                if (remember) {
                    localStorage.setItem('fspLogin', 'true');
                    localStorage.setItem('fspLoginTime', Date.now().toString());
                } else {
                    sessionStorage.setItem('fspLogin', 'true');
                }
                
                this.showSuccessMessage();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.setLoadingState(loginBtn, false);
                this.showError('ভুল ফোন নম্বর বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।');
            }
        }, 1000);
    }

    setLoadingState(button, loading) {
        const btnContent = button.querySelector('.btn-content');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            if (btnContent) btnContent.style.opacity = '0';
            if (btnLoader) btnLoader.style.display = 'flex';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            if (btnContent) btnContent.style.opacity = '1';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.style.display = 'flex';
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    showSuccessMessage() {
        const successDiv = document.getElementById('successMessage');
        const loginBtn = document.getElementById('loginButton');
        
        if (successDiv) {
            successDiv.style.display = 'flex';
        }
        
        if (loginBtn) {
            loginBtn.style.background = '#28a745';
        }
    }

    // Accessibility Enhancements
    setupAccessibility() {
        // Announce theme changes
        const themeToggle = document.getElementById('loginThemeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const theme = document.body.getAttribute('data-theme');
                const message = theme === 'dark' ? 
                    'ডার্ক মোড চালু করা হয়েছে' : 
                    'লাইট মোড চালু করা হয়েছে';
                this.announceToScreenReader(message);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Clear any error messages
                const errorDiv = document.getElementById('errorMessage');
                if (errorDiv && errorDiv.style.display !== 'none') {
                    errorDiv.style.display = 'none';
                }
            }
        });
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Setup existing functionality
    setupExistingFunctionality() {
        // Password toggle functionality
        window.togglePassword = () => {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.getElementById('toggleIcon');
            
            if (passwordInput && toggleIcon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    toggleIcon.className = 'fas fa-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    toggleIcon.className = 'fas fa-eye';
                }
            }
        };
        
        // Check if already logged in
        this.checkExistingLogin();
    }

    checkExistingLogin() {
        const isLoggedIn = localStorage.getItem('fspLogin') || sessionStorage.getItem('fspLogin');
        const loginTime = localStorage.getItem('fspLoginTime');
        
        if (isLoggedIn) {
            if (loginTime) {
                const timeDiff = Date.now() - parseInt(loginTime);
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                
                if (hoursDiff < 24) {
                    window.location.href = 'index.html';
                } else {
                    localStorage.removeItem('fspLogin');
                    localStorage.removeItem('fspLoginTime');
                }
            } else {
                window.location.href = 'index.html';
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginEnhancements();
});

// Export for potential use
window.LoginEnhancements = LoginEnhancements;
