// ===== THEME TOGGLE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    lucide.createIcons();
    
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        
        // Add animation class for smooth transition
        themeToggle.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
    
    // ===== CARD INTERACTIONS =====
    
    // Add hover sound effect (optional - you can remove this if you don't want sound)
    const cards = document.querySelectorAll('.link-card, .skill-card, .social-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform || '';
        });
    });
    
    // ===== SCROLL ANIMATIONS =====
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('.hero-section, .quick-links, .skills-section, .social-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // ===== DYNAMIC STATS COUNTER =====
    
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/\D/g, ''));
            const suffix = finalValue.replace(/\d/g, '');
            let currentValue = 0;
            const increment = numericValue / 50; // Adjust speed here
            
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    stat.textContent = finalValue;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(currentValue) + suffix;
                }
            }, 30);
        });
    }
    
    // Trigger stats animation when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // ===== KEYBOARD NAVIGATION =====
    
    // Add keyboard support for interactive elements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ===== PERFORMANCE OPTIMIZATION =====
    
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Add subtle parallax effect to background elements
    const bgGradient = document.querySelector('.bg-gradient');
    const bgPattern = document.querySelector('.bg-pattern');
    
    const handleScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (bgGradient) {
            bgGradient.style.transform = `translateY(${rate}px)`;
        }
        if (bgPattern) {
            bgPattern.style.transform = `translateY(${rate * 0.3}px)`;
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // ===== LOADING ANIMATION =====
    
    // Add staggered loading animation for cards
    const allCards = document.querySelectorAll('.profile-card, .bio-card, .link-card, .skill-card, .social-card');
    
    allCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // ===== COPY TO CLIPBOARD FUNCTIONALITY =====
    
    // Add copy functionality for email
    const emailCard = document.querySelector('.social-card.email');
    if (emailCard) {
        emailCard.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.querySelector('.social-info p').textContent;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showNotification('Email copied to clipboard!');
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Email copied to clipboard!');
            }
        });
    }
    
    // ===== NOTIFICATION SYSTEM =====
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 1rem 2rem;
            border-radius: 12px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px var(--shadow-light);
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-primary);
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    console.log('🎉 About Me page loaded successfully!');
});// ===== ADVANCED ANIMATIONS =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CARD HOVER ANIMATIONS =====
    
    // Enhanced hover effects for link cards
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle scale and shadow animation
            this.style.transform = 'translateY(-4px) scale(1.02)';
            this.style.boxShadow = '0 25px 80px var(--shadow-medium)';
            
            // Animate the icon
            const icon = this.querySelector('.link-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            // Animate the arrow
            const arrow = this.querySelector('.link-arrow');
            if (arrow) {
                arrow.style.transform = 'translate(4px, -4px) rotate(15deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.link-icon');
            if (icon) {
                icon.style.transform = '';
            }
            
            const arrow = this.querySelector('.link-arrow');
            if (arrow) {
                arrow.style.transform = '';
            }
        });
    });
    
    // ===== SKILL CARD ANIMATIONS =====
    
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Create ripple effect
            createRippleEffect(this);
            
            // Bounce animation for icon
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.animation = 'bounce 0.6s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });
    
    // ===== PROFILE IMAGE ANIMATION =====
    
    const profileImage = document.querySelector('.profile-image img');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
            this.style.filter = 'brightness(1.1) contrast(1.1)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.filter = '';
        });
    }
    
    // ===== FLOATING ANIMATION FOR CARDS =====
    
    function addFloatingAnimation() {
        const cards = document.querySelectorAll('.profile-card, .bio-card');
        
        cards.forEach((card, index) => {
            // Add subtle floating animation with different delays
            card.style.animation = `float 6s ease-in-out infinite`;
            card.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    // Add CSS keyframes dynamically
    const floatingKeyframes = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1); }
            50% { transform: scale(0.95); }
            75% { transform: scale(1.05); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    
    // Inject keyframes into the page
    const style = document.createElement('style');
    style.textContent = floatingKeyframes;
    document.head.appendChild(style);
    
    // Apply floating animation
    setTimeout(addFloatingAnimation, 1000);
    
    // ===== RIPPLE EFFECT FUNCTION =====
    
    function createRippleEffect(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(102, 126, 234, 0.1)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // ===== SCROLL PROGRESS INDICATOR =====
    
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }
    
    createScrollProgress();
    
    console.log('✨ Animations loaded successfully!');
});