// navigation.js - Navigation Menu and Scroll Functionality
// Handles hamburger menu, smooth scrolling, and mobile navigation

/**
 * Initialize Navigation
 * Sets up all navigation-related event listeners
 */
document.addEventListener('DOMContentLoaded', function () {

    // Get navigation elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    /**
     * Toggle Mobile Menu
     * Opens and closes the navigation menu on mobile devices
     */
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            // Toggle active class on hamburger and menu
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    /**
     * Close Menu When Link is Clicked
     * Closes mobile menu after clicking a navigation link
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    /**
     * Header Scroll Effect
     * Adds shadow to header when scrolling
     */
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /**
     * Highlight Active Section in Navigation
     * Updates navigation to show which section is currently visible
     */
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Call on scroll
    window.addEventListener('scroll', highlightActiveSection);

    /**
     * Close Mobile Menu on Window Resize
     * Ensures menu is closed when switching to desktop view
     */
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

});
