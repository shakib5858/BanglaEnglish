// FSP Team - Professional Website JavaScript
// WordPress Theme Ready - JS organized for easy conversion

// ===== PIXEL TRACKING SIMULATION =====
class PixelTracker {
    constructor() {
        this.events = [];
        this.init();
    }

    init() {
        // Simulate Facebook Pixel
        console.log('🎯 FSP Team Pixel Tracker Initialized');
        this.trackPageView();
        this.setupClickTracking();
        this.setupFormTracking();
    }

    trackPageView() {
        const pageData = {
            event: 'PageView',
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        this.logEvent(pageData);
    }

    trackClick(element, eventName = 'Click') {
        const clickData = {
            event: eventName,
            element: element.tagName,
            text: element.textContent?.slice(0, 50) || '',
            href: element.href || '',
            timestamp: new Date().toISOString()
        };
        
        this.logEvent(clickData);
    }

    trackFormSubmission(formId, formData) {
        const submissionData = {
            event: 'FormSubmit',
            formId: formId,
            fields: Object.keys(formData),
            timestamp: new Date().toISOString()
        };
        
        this.logEvent(submissionData);
    }

    setupClickTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .nav-link, .service-link, .footer-links a')) {
                this.trackClick(e.target, 'ButtonClick');
            }
        });
    }

    setupFormTracking() {
        // Track form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                this.trackFormSubmission(e.target.id, data);
            }
        });
    }

    logEvent(eventData) {
        this.events.push(eventData);
        console.log('📊 Pixel Event:', eventData);
        
        // Simulate sending to analytics service
        if (this.events.length > 0) {
            console.log(`📈 Total Events Tracked: ${this.events.length}`);
        }
    }

    getEvents() {
        return this.events;
    }
}

// ===== MOBILE NAVIGATION =====
class MobileNavigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar')) {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}

// ===== TESTIMONIALS SLIDER =====
class TestimonialsSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials-slider');
        this.track = document.querySelector('.testimonial-track');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        
        if (this.slider) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateSlider();
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause autoplay on hover
        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.cards.length;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.cards.length) % this.cards.length;
        this.updateSlider();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }

    updateSlider() {
        // Update cards
        this.cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentSlide);
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        // Transform track
        if (this.track) {
            this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ===== FAQ ACCORDION =====
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        this.faqItems.forEach(faqItem => {
            if (faqItem !== item) {
                faqItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active', !isActive);
    }
}

// ===== FORM VALIDATION =====
class FormValidator {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const isValid = this.validateForm(form);
        
        if (isValid) {
            this.submitForm(form);
        }
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }
        // Name validation
        else if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            }
        }
        // Message validation
        else if (fieldName === 'message' && value) {
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }

    async submitForm(form) {
        const submitBtn = form.querySelector('.form-submit');
        const spinner = form.querySelector('.loading-spinner');
        const successMessage = form.querySelector('.form-success');
        
        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
        if (spinner) {
            spinner.classList.add('show');
        }

        try {
            // Simulate form submission
            await this.simulateFormSubmission(form);
            
            // Show success message
            if (successMessage) {
                form.style.display = 'none';
                successMessage.classList.add('show');
            }
            
            // Track form submission
            if (window.pixelTracker) {
                const formData = new FormData(form);
                window.pixelTracker.trackFormSubmission(form.id, Object.fromEntries(formData));
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
            if (spinner) {
                spinner.classList.remove('show');
            }
        }
    }

    simulateFormSubmission(form) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                console.log('✅ Form submitted successfully:', form.id);
                resolve();
            }, 2000);
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .pricing-card, .value-card, .team-member');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.querySelector('.header');
        this.init();
    }

    init() {
        if (this.navbar) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce scroll events
        this.debounceScrollEvents();
        
        // Preload critical resources
        this.preloadResources();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    debounceScrollEvents() {
        let ticking = false;
        
        const updateScrollEvents = () => {
            // Trigger scroll-based animations here
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEvents);
                ticking = true;
            }
        });
    }

    preloadResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FSP Team Website Initialized');
    
    // Initialize all components
    window.pixelTracker = new PixelTracker();
    new MobileNavigation();
    new SmoothScroll();
    new TestimonialsSlider();
    new FAQAccordion();
    new FormValidator();
    new ScrollAnimations();
    new NavbarScrollEffect();
    new PerformanceOptimizer();
    
    console.log('✅ All components loaded successfully');
});

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format phone number
    formatPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    },

    // Validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Get viewport dimensions
    getViewportSize() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===== EXPORT FOR WORDPRESS INTEGRATION =====
// These functions can be easily integrated into WordPress themes
window.FSPTeam = {
    PixelTracker,
    MobileNavigation,
    SmoothScroll,
    TestimonialsSlider,
    FAQAccordion,
    FormValidator,
    ScrollAnimations,
    NavbarScrollEffect,
    PerformanceOptimizer,
    Utils
};

// ===== CONSOLE BRANDING =====
console.log('%c🎯 FSP Team Website', 'color: #0b66ff; font-size: 20px; font-weight: bold;');
console.log('%cProfessional Ad Campaign & Pixel Setup Agency', 'color: #00c48c; font-size: 14px;');
console.log('%cWebsite ready for WordPress conversion', 'color: #666; font-size: 12px;');
