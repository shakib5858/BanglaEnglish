/**
 * Modern UI/UX Enhancement Scripts for FSP Digital Marketing Course
 * Handles loading screen, dark mode, mobile navigation, search, and accessibility
 */

class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupDarkMode();
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupSearchEnhancements();
        this.setupAccessibility();
        this.setupAnimations();
        this.setupKeyboardNavigation();
    }

    // Loading Screen Management
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (loadingScreen) {
            // Simulate loading time
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1500);
        }
    }

    // Dark Mode Toggle
    setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                const currentTheme = body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        const body = document.body;
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Mobile Menu Toggle
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                const isActive = mobileMenuToggle.classList.contains('active');
                
                mobileMenuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                mobileMenuToggle.setAttribute('aria-expanded', !isActive);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Scroll Effects
    setupScrollEffects() {
        const scrollProgress = document.querySelector('.scroll-progress');
        const header = document.querySelector('.main-nav');
        
        window.addEventListener('scroll', () => {
            // Update scroll progress
            if (scrollProgress) {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                scrollProgress.style.width = `${scrollPercent}%`;
            }
            
            // Add scrolled class to navigation
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Enhanced Search Functionality
    setupSearchEnhancements() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const searchClear = document.getElementById('searchClear');
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        if (!searchInput) return;

        // Sample search data (in real app, this would come from API)
        const searchData = [
            'SEO অপটিমাইজেশন',
            'Google Ads',
            'Facebook Marketing',
            'Content Marketing',
            'Email Marketing',
            'Social Media Strategy',
            'AI Tools',
            'Analytics',
            'Keyword Research',
            'Link Building'
        ];

        let currentSuggestionIndex = -1;

        // Show/hide clear button
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            
            if (searchClear) {
                searchClear.style.display = value ? 'block' : 'none';
            }
            
            // Show suggestions
            if (value.length > 1) {
                this.showSearchSuggestions(value, searchData, searchSuggestions);
            } else {
                this.hideSearchSuggestions(searchSuggestions);
            }
        });

        // Clear search
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.style.display = 'none';
                this.hideSearchSuggestions(searchSuggestions);
                searchInput.focus();
            });
        }

        // Keyboard navigation for suggestions
        searchInput.addEventListener('keydown', (e) => {
            const suggestions = searchSuggestions?.querySelectorAll('.search-suggestion');
            
            if (!suggestions || suggestions.length === 0) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, suggestions.length - 1);
                    this.highlightSuggestion(suggestions, currentSuggestionIndex);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
                    this.highlightSuggestion(suggestions, currentSuggestionIndex);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (currentSuggestionIndex >= 0) {
                        suggestions[currentSuggestionIndex].click();
                    } else {
                        this.performSearch(searchInput.value);
                    }
                    break;
                case 'Escape':
                    this.hideSearchSuggestions(searchSuggestions);
                    currentSuggestionIndex = -1;
                    break;
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions?.contains(e.target)) {
                this.hideSearchSuggestions(searchSuggestions);
            }
        });
    }

    showSearchSuggestions(query, data, container) {
        if (!container) return;

        const filtered = data.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filtered.length === 0) {
            this.hideSearchSuggestions(container);
            return;
        }

        container.innerHTML = filtered.map(item => 
            `<div class="search-suggestion" role="option">${item}</div>`
        ).join('');

        container.style.display = 'block';

        // Add click handlers
        container.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                document.getElementById('searchInput').value = suggestion.textContent;
                this.hideSearchSuggestions(container);
                this.performSearch(suggestion.textContent);
            });
        });
    }

    hideSearchSuggestions(container) {
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    highlightSuggestion(suggestions, index) {
        suggestions.forEach((suggestion, i) => {
            suggestion.classList.toggle('highlighted', i === index);
        });
    }

    performSearch(query) {
        // This would integrate with your existing search functionality
        console.log('Searching for:', query);
        // Trigger existing search function if available
        if (window.searchLessons) {
            window.searchLessons(query);
        }
    }

    // Accessibility Enhancements
    setupAccessibility() {
        const accessibilityToggle = document.getElementById('accessibilityToggle');
        
        if (accessibilityToggle) {
            accessibilityToggle.addEventListener('click', () => {
                this.toggleHighContrast();
            });
        }

        // Focus management
        this.setupFocusManagement();
        
        // Announce page changes to screen readers
        this.setupAriaLiveRegions();
    }

    toggleHighContrast() {
        const body = document.body;
        body.classList.toggle('high-contrast-mode');
        
        const isHighContrast = body.classList.contains('high-contrast-mode');
        localStorage.setItem('highContrast', isHighContrast);
        
        // Announce change to screen readers
        this.announceToScreenReader(
            isHighContrast ? 'উচ্চ কনট্রাস্ট মোড চালু করা হয়েছে' : 'উচ্চ কনট্রাস্ট মোড বন্ধ করা হয়েছে'
        );
    }

    setupFocusManagement() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.lesson-modal:not([style*="display: none"])');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    setupAriaLiveRegions() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    // Animation and Counter Effects
    setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.stat-item, .overview-card, .lesson-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const numberElement = element.querySelector('.stat-number');
        
        if (!numberElement || !target) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(current);
        }, 40);
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        // Add keyboard support for custom elements
        document.addEventListener('keydown', (e) => {
            // ESC key handling
            if (e.key === 'Escape') {
                // Close any open modals or dropdowns
                const modal = document.querySelector('.lesson-modal');
                if (modal && modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
                
                // Close mobile menu
                const mobileMenu = document.getElementById('navMenu');
                const mobileToggle = document.getElementById('mobileMenuToggle');
                if (mobileMenu?.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileToggle?.classList.remove('active');
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UIEnhancements();
});

// Export for use in other scripts
window.UIEnhancements = UIEnhancements;
