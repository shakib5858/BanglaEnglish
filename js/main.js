// Enhanced Digital Marketing Course JavaScript
// FSP Team - 30 Day Digital Marketing Course with improved UI/UX

class DigitalMarketingCourse {
    constructor() {
        this.currentLesson = 1;
        this.completedLessons = this.getCompletedLessons();
        this.searchIndex = [];
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLessons();
        this.updateProgress();
        this.setupSearch();
        this.setupNavigation();
        this.setupAccordions();
        this.setupTabs();
        this.loadUserPreferences();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
    }

    setupEventListeners() {
        // Navigation links with smooth scrolling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(link.getAttribute('href'));
                this.setActiveNavLink(link);
            });
        });

        // Enhanced search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });

            // Add loading state to search
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('search-focused');
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('search-focused');
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
        }

        // Enhanced lesson card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lesson-card')) {
                const lessonCard = e.target.closest('.lesson-card');
                const lessonNumber = parseInt(lessonCard.dataset.lesson);
                this.openLesson(lessonNumber);
                
                // Add ripple effect
                this.createRippleEffect(e, lessonCard);
            }
        });

        // Scroll-based navigation highlighting
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));

        // High contrast toggle
        this.setupHighContrastToggle();
        this.setupProgressTracking();
    }

    // Throttle function for performance
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
        }
    }

    // Enhanced navigation with smooth scrolling
    navigateToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.main-nav').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            this.smoothScrollTo(targetPosition, 800);
        }
    }

    // Custom smooth scroll implementation
    smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const run = this.easeInOutQuad(elapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (elapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    // Easing function for smooth animations
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    // Handle scroll events
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const nav = document.querySelector('.main-nav');
        
        // Add scrolled class to navigation
        if (scrollTop > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active navigation link based on scroll position
        this.updateActiveNavOnScroll();
    }

    // Update active navigation based on scroll position
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Setup intersection observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.overview-card, .lesson-card, .resource-card, .progress-stat').forEach(el => {
            observer.observe(el);
        });
    }

    // Setup scroll animations
    setupScrollAnimations() {
        // Add CSS classes for animations
        const style = document.createElement('style');
        style.textContent = `
            .overview-card, .lesson-card, .resource-card, .progress-stat {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .search-focused {
                transform: scale(1.02);
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(59, 130, 246, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create ripple effect on click
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Enhanced lesson loading with stagger animation
    loadLessons() {
        const lessonsGrid = document.getElementById('lessonsGrid');
        if (!lessonsGrid) return;

        const lessons = this.getLessonsData();
        lessonsGrid.innerHTML = '';

        lessons.forEach((lesson, index) => {
            const lessonCard = this.createLessonCard(lesson, index + 1);
            lessonCard.style.animationDelay = `${index * 0.1}s`;
            lessonsGrid.appendChild(lessonCard);
        });
    }

    // Enhanced progress update with animations
    updateProgress() {
        const completedCount = this.completedLessons.length;
        const totalLessons = 30;
        const progressPercentage = Math.round((completedCount / totalLessons) * 100);

        // Animate progress bar
        const progressFill = document.getElementById('overallProgress');
        const progressPercentageElement = document.querySelector('.progress-percentage');
        
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.width = `${progressPercentage}%`;
            }, 500);
        }
        
        if (progressPercentageElement) {
            this.animateNumber(progressPercentageElement, 0, progressPercentage, 1000, '%');
        }

        // Animate stats
        const completedLessonsElement = document.getElementById('completedLessons');
        const remainingLessonsElement = document.getElementById('remainingLessons');
        const currentStreakElement = document.getElementById('currentStreak');

        if (completedLessonsElement) {
            this.animateNumber(completedLessonsElement, 0, completedCount, 800);
        }
        
        if (remainingLessonsElement) {
            this.animateNumber(remainingLessonsElement, totalLessons, totalLessons - completedCount, 800);
        }
        
        if (currentStreakElement) {
            this.animateNumber(currentStreakElement, 0, this.calculateStreak(), 600);
        }
    }

    // Animate numbers with easing
    animateNumber(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        const difference = end - start;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = this.easeOutQuart(progress);
            const current = Math.round(start + (difference * easedProgress));
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    // Easing function for number animation
    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    // Enhanced search with loading state
    performSearch(query) {
        const searchBtn = document.querySelector('.search-btn');
        
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }

        // Add loading state
        searchBtn.classList.add('loading');
        
        setTimeout(() => {
            const results = this.searchLessons(query);
            this.displaySearchResults(results, query);
            searchBtn.classList.remove('loading');
        }, 300);
    }

    // Enhanced notification system
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                </div>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    removeNotification(notification) {
        notification.classList.add('removing');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    // Rest of the methods remain the same...
    getLessonsData() {
        return [
            {
                title: "SEO এর মূল ভিত্তি (SEO Fundamentals)",
                description: "Search Engine Optimization এর বেসিক ধারণা এবং কীভাবে Google এ র‍্যাঙ্ক করতে হয়",
                topics: ["SEO বেসিক", "Keywords", "Search Console"],
                day: 1
            },
            {
                title: "On-Page SEO কৌশল",
                description: "Title, Meta Description, Header Tags এবং Content Optimization",
                topics: ["Title Tags", "Meta Description", "Header Tags", "Internal Linking"],
                day: 2
            },
            {
                title: "Off-Page SEO ও Link Building",
                description: "Backlinks, Domain Authority এবং Link Building Strategy",
                topics: ["Backlinks", "Guest Posting", "Directory Submission", "Social Signals"],
                day: 3
            },
            {
                title: "Technical SEO ও Core Web Vitals",
                description: "Website Speed, Mobile Optimization এবং Technical Issues",
                topics: ["Page Speed", "Mobile-First", "Core Web Vitals", "Schema Markup"],
                day: 4
            },
            {
                title: "Google Ads এর পরিচিতি",
                description: "Search Engine Marketing এর ভিত্তি এবং Google Ads Account Setup",
                topics: ["SEM বেসিক", "Account Setup", "Campaign Types", "Bidding"],
                day: 5
            },
            {
                title: "PPC Campaign ব্যবস্থাপনা",
                description: "Pay-Per-Click Campaign তৈরি এবং Optimization",
                topics: ["Campaign Structure", "Ad Groups", "Keywords", "Ad Copy"],
                day: 6
            },
            {
                title: "Advanced Google Ads কৌশল",
                description: "Conversion Tracking, Remarketing এবং Advanced Features",
                topics: ["Conversion Tracking", "Remarketing", "Extensions", "Automation"],
                day: 7
            },
            {
                title: "SEM Advanced Strategies",
                description: "Shopping Ads, Display Network এবং YouTube Ads",
                topics: ["Shopping Ads", "Display Network", "YouTube Ads", "Performance Max"],
                day: 8
            },
            {
                title: "Facebook Marketing এর ভিত্তি",
                description: "Facebook Business Page, Content Strategy এবং Organic Reach",
                topics: ["Business Page", "Content Planning", "Engagement", "Analytics"],
                day: 9
            },
            {
                title: "Facebook Ads Campaign",
                description: "Facebook Ads Manager, Campaign Objectives এবং Targeting",
                topics: ["Ads Manager", "Campaign Types", "Audience Targeting", "Budget"],
                day: 10
            },
            {
                title: "Instagram Marketing",
                description: "Visual Content Marketing এর শক্তিশালী প্ল্যাটফর্ম",
                topics: ["Business Account", "Stories", "Reels", "Shopping", "Hashtags"],
                day: 11
            },
            {
                title: "LinkedIn ও Professional Marketing",
                description: "B2B Marketing এবং Professional Network Building",
                topics: ["Company Page", "LinkedIn Ads", "Content Strategy", "Lead Generation"],
                day: 12
            },
            {
                title: "TikTok Marketing কৌশল",
                description: "Short-form Video Content এবং Viral Marketing",
                topics: ["TikTok Business", "Video Content", "Trends", "TikTok Ads"],
                day: 13
            },
            {
                title: "YouTube Marketing ও SEO",
                description: "Video Marketing এবং YouTube Channel Optimization",
                topics: ["Channel Setup", "Video SEO", "YouTube Ads", "Analytics"],
                day: 14
            },
            {
                title: "Content Marketing Strategy",
                description: "Content Planning, Creation এবং Distribution",
                topics: ["Content Calendar", "Blog Writing", "Visual Content", "Content SEO"],
                day: 15
            },
            {
                title: "AI Content Creation",
                description: "ChatGPT, Jasper এবং AI Tools দিয়ে Content তৈরি",
                topics: ["ChatGPT", "AI Writing Tools", "Content Automation", "Quality Control"],
                day: 16
            },
            {
                title: "Video Content ও Reels",
                description: "Video Marketing এবং Short-form Content Strategy",
                topics: ["Video Planning", "Editing Tools", "Reels Strategy", "Live Streaming"],
                day: 17
            },
            {
                title: "Blogging ও Website Content",
                description: "Blog Writing, SEO Content এবং Website Copy",
                topics: ["Blog Strategy", "SEO Writing", "Website Copy", "Content Updates"],
                day: 18
            },
            {
                title: "Email Marketing Fundamentals",
                description: "Email List Building এবং Campaign Strategy",
                topics: ["List Building", "Email Design", "Segmentation", "Automation"],
                day: 19
            },
            {
                title: "Email Automation",
                description: "Drip Campaigns, Welcome Series এবং Behavioral Triggers",
                topics: ["Drip Campaigns", "Welcome Series", "Behavioral Emails", "A/B Testing"],
                day: 20
            },
            {
                title: "Advanced Email Marketing",
                description: "Personalization, Analytics এবং Deliverability",
                topics: ["Personalization", "Email Analytics", "Deliverability", "GDPR"],
                day: 21
            },
            {
                title: "Google Analytics 4",
                description: "GA4 Setup, Reports এবং Data Analysis",
                topics: ["GA4 Setup", "Reports", "Conversions", "Audiences"],
                day: 22
            },
            {
                title: "Social Media Analytics",
                description: "Facebook Insights, Instagram Analytics এবং Social ROI",
                topics: ["Facebook Insights", "Instagram Analytics", "Social ROI", "Reporting"],
                day: 23
            },
            {
                title: "Marketing Analytics ও ROI",
                description: "Campaign Performance, Attribution এবং Data-driven Decisions",
                topics: ["Performance Metrics", "Attribution", "ROI Calculation", "Dashboards"],
                day: 24
            },
            {
                title: "Facebook Ads Advanced",
                description: "Advanced Targeting, Custom Audiences এবং Lookalike",
                topics: ["Custom Audiences", "Lookalike Audiences", "Retargeting", "Optimization"],
                day: 25
            },
            {
                title: "Google Ads Mastery",
                description: "Advanced Google Ads Features এবং Optimization",
                topics: ["Smart Campaigns", "Responsive Ads", "Bid Strategies", "Quality Score"],
                day: 26
            },
            {
                title: "Multi-Platform Advertising",
                description: "TikTok Ads, LinkedIn Ads এবং Cross-platform Strategy",
                topics: ["TikTok Ads", "LinkedIn Ads", "Cross-platform", "Budget Allocation"],
                day: 27
            },
            {
                title: "AI Tools ও Automation",
                description: "ChatGPT, MidJourney, Canva AI এবং Marketing Automation",
                topics: ["ChatGPT Marketing", "AI Design Tools", "Automation Tools", "Workflow"],
                day: 28
            },
            {
                title: "Marketing Automation",
                description: "CRM Integration, Lead Nurturing এবং Sales Funnel",
                topics: ["CRM Integration", "Lead Nurturing", "Sales Funnel", "Customer Journey"],
                day: 29
            },
            {
                title: "Digital Marketing Strategy",
                description: "Complete Marketing Plan, Budget Allocation এবং Future Planning",
                topics: ["Marketing Plan", "Budget Planning", "Team Building", "Scaling"],
                day: 30
            }
        ];
    }

    createLessonCard(lesson, lessonNumber) {
        const isCompleted = this.completedLessons.includes(lessonNumber);
        const isLocked = lessonNumber > this.currentLesson && !isCompleted;
        
        const card = document.createElement('div');
        card.className = `lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
        card.dataset.lesson = lessonNumber;
        
        card.innerHTML = `
            <div class="lesson-day">দিন ${lessonNumber}</div>
            <h3 class="lesson-title">${lesson.title}</h3>
            <p class="lesson-description">${lesson.description}</p>
            <div class="lesson-topics">
                ${lesson.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
            </div>
            <div class="lesson-status">
                ${isCompleted ? '<i class="fas fa-check-circle"></i> সম্পূর্ণ' : 
                  isLocked ? '<i class="fas fa-lock"></i> লক করা' : 
                  '<i class="fas fa-play-circle"></i> শুরু করুন'}
            </div>
        `;
        
        return card;
    }

    openLesson(lessonNumber) {
        if (lessonNumber > this.currentLesson && !this.completedLessons.includes(lessonNumber)) {
            this.showNotification('এই পাঠটি এখনো লক করা আছে। আগের পাঠগুলো সম্পূর্ণ করুন।', 'warning');
            return;
        }
        
        // Check if lesson file exists
        const lessonFile = `lessons/day-${lessonNumber}.html`;
        window.location.href = lessonFile;
    }

    markLessonComplete(lessonNumber) {
        if (!this.completedLessons.includes(lessonNumber)) {
            this.completedLessons.push(lessonNumber);
            this.saveCompletedLessons();
            this.updateProgress();
            this.loadLessons(); // Refresh lesson cards
            
            // Unlock next lesson
            if (lessonNumber === this.currentLesson) {
                this.currentLesson = Math.min(30, this.currentLesson + 1);
                localStorage.setItem('currentLesson', this.currentLesson);
            }
            
            this.showNotification(`দিন ${lessonNumber} এর পাঠ সম্পূর্ণ হয়েছে!`, 'success');
        }
    }

    getCompletedLessons() {
        const completed = localStorage.getItem('completedLessons');
        return completed ? JSON.parse(completed) : [];
    }

    saveCompletedLessons() {
        localStorage.setItem('completedLessons', JSON.stringify(this.completedLessons));
    }

    calculateStreak() {
        // Simple streak calculation - can be enhanced
        return this.completedLessons.length > 0 ? Math.min(this.completedLessons.length, 7) : 0;
    }

    searchLessons(query) {
        const lessons = this.getLessonsData();
        const searchTerm = query.toLowerCase();
        
        return lessons.filter(lesson => 
            lesson.title.toLowerCase().includes(searchTerm) ||
            lesson.description.toLowerCase().includes(searchTerm) ||
            lesson.topics.some(topic => topic.toLowerCase().includes(searchTerm))
        );
    }

    displaySearchResults(results, query) {
        const lessonsGrid = document.getElementById('lessonsGrid');
        if (!lessonsGrid) return;

        if (results.length === 0) {
            lessonsGrid.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <h3>"${query}" এর জন্য কোনো ফলাফল পাওয়া যায়নি</h3>
                    <p>অন্য কিছু খোঁজার চেষ্টা করুন</p>
                </div>
            `;
            return;
        }

        lessonsGrid.innerHTML = `
            <div class="search-results-header">
                <h3>"${query}" এর জন্য ${results.length}টি ফলাফল পাওয়া গেছে</h3>
                <button class="clear-search-btn" onclick="window.digitalMarketingCourse.clearSearchResults()">
                    <i class="fas fa-times"></i> সব দেখুন
                </button>
            </div>
        `;

        results.forEach((lesson, index) => {
            const lessonCard = this.createLessonCard(lesson, lesson.day);
            lessonCard.style.animationDelay = `${index * 0.1}s`;
            lessonsGrid.appendChild(lessonCard);
        });
    }

    clearSearchResults() {
        document.getElementById('searchInput').value = '';
        this.loadLessons();
    }

    setupSearch() {
        // Build search index
        this.searchIndex = this.getLessonsData();
    }

    setupNavigation() {
        // Navigation is already set up in setupEventListeners
    }

    setupAccordions() {
        // For lesson pages - accordion functionality
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const accordion = header.closest('.accordion');
                const content = accordion.querySelector('.accordion-content');
                const isOpen = accordion.classList.contains('open');
                
                // Close all other accordions
                document.querySelectorAll('.accordion').forEach(acc => {
                    acc.classList.remove('open');
                });
                
                // Toggle current accordion
                if (!isOpen) {
                    accordion.classList.add('open');
                }
            });
        });
    }

    setupTabs() {
        // Tab functionality for lesson pages
        document.querySelectorAll('.tab-header').forEach(header => {
            header.addEventListener('click', () => {
                const tabGroup = header.closest('.tabs');
                const targetTab = header.dataset.tab;
                
                tabGroup.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
                tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                header.classList.add('active');
                tabGroup.querySelector(`[data-tab-content="${targetTab}"]`).classList.add('active');
            });
        });
    }

    loadUserPreferences() {
        // Load high contrast mode
        const highContrast = localStorage.getItem('highContrast') === 'true';
        if (highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // Load current lesson
        const savedCurrentLesson = localStorage.getItem('currentLesson');
        if (savedCurrentLesson) {
            this.currentLesson = parseInt(savedCurrentLesson);
        }
    }

    setupHighContrastToggle() {
        // Add high contrast toggle button
        const nav = document.querySelector('.main-nav .container');
        if (nav && !document.querySelector('.contrast-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'contrast-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-adjust"></i>';
            toggleBtn.title = 'High Contrast Mode';
            
            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
                const isHighContrast = document.body.classList.contains('high-contrast');
                localStorage.setItem('highContrast', isHighContrast);
                
                this.showNotification(
                    isHighContrast ? 'High Contrast Mode চালু করা হয়েছে' : 'High Contrast Mode বন্ধ করা হয়েছে',
                    'info'
                );
            });
            
            nav.appendChild(toggleBtn);
        }
    }

    setupProgressTracking() {
        // Track time spent on page
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            const currentPage = window.location.pathname;
            
            // Save time spent data
            const timeData = JSON.parse(localStorage.getItem('timeSpent') || '{}');
            timeData[currentPage] = (timeData[currentPage] || 0) + timeSpent;
            localStorage.setItem('timeSpent', JSON.stringify(timeData));
        });
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupSmoothScrolling() {
        // Already implemented in navigateToSection method
    }
}

// Initialize the enhanced course
document.addEventListener('DOMContentLoaded', () => {
    window.digitalMarketingCourse = new DigitalMarketingCourse();
});
