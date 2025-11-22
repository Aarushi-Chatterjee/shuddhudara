// animations.js - Scroll Animations and Interactive Effects
// Handles scroll-triggered animations and visual enhancements

/**
 * Intersection Observer for Scroll Animations
 * Animates elements as they come into view
 */
document.addEventListener('DOMContentLoaded', function () {

    /**
     * Scroll Reveal Animation
     * Shows elements with fade-in effect when scrolling
     */
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.scroll-reveal');

        if (revealElements.length === 0) return;

        // Create Intersection Observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add active class when element is in view
                    entry.target.classList.add('active');
                    // Stop observing this element
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
        });

        // Observe all reveal elements
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    };

    /**
     * FAQ Accordion Toggle
     * Expands and collapses FAQ items
     */
    const initFAQAccordion = () => {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', function () {
                const faqItem = this.parentElement;
                const isActive = faqItem.classList.contains('active');

                // Close all other FAQ items (optional - remove for multiple open FAQs)
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    };

    /**
     * Solution Card Hover Effects
     * Adds dynamic hover animations to solution cards
     */
    const initSolutionCardEffects = () => {
        const solutionCards = document.querySelectorAll('.solution-card');

        solutionCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                // Add pulse effect or other animations here if desired
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = '';
            });
        });
    };

    /**
     * Parallax Effect for Hero Section
     * Creates subtle parallax scrolling effect
     */
    const initParallaxEffect = () => {
        const hero = document.querySelector('.hero');

        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    };

    /**
     * Smooth Fade-In for Page Load
     * Fades in content when page loads
     */
    const initPageLoadAnimation = () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';

        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    };

    /**
     * Animate Numbers (Count Up Effect)
     * Useful for statistics or metrics
     */
    const animateNumbers = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };

        updateNumber();
    };

    // Initialize all animations
    initScrollReveal();
    initFAQAccordion();
    initSolutionCardEffects();
    initParallaxEffect();

    // Optional: Uncomment if you want page load fade-in
    // initPageLoadAnimation();

    /**
     * Add Stagger Animation to Team Members
     * Animates team member cards with delay
     */
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
        member.style.animationDelay = `${index * 0.1}s`;
    });

});

/**
 * Utility: Debounce Function
 * Limits how often a function can be called
 * Useful for scroll and resize events
 */
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
