// loginHandler.js - Frontend Authentication Logic
// Handles login form submission and API communication

// API Base URL - Update this if your backend is hosted elsewhere
// API Base URL - Dynamic based on environment
const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api/auth';
    }
    return '/api/auth';
};
const API_URL = getApiUrl();

/**
 * Initialize Login Form
 */
document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const passwordToggle = document.getElementById('passwordToggle');

    /**
     * Toggle Password Visibility
     */
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Update icon (if using icon fonts)
            this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }

    /**
     * Handle Login Form Submission
     */
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Clear previous messages
            hideMessage(errorMessage);
            hideMessage(successMessage);

            // Get form values
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Validate inputs
            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            // Disable button and show loading state
            loginButton.disabled = true;
            loginButton.classList.add('loading');
            loginButton.textContent = 'Signing In...';

            // Real API Call
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showSuccess('Login successful! Redirecting...');

                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    setTimeout(() => {
                        window.location.href = '../dashboard/dashboard.html';
                    }, 1500);
                } else {
                    showError(data.message || 'Login failed. Please check your credentials.');
                }

            } catch (error) {
                console.error('Login error:', error);
                showError('Connection error. Please ensure the backend server is running.');
            } finally {
                loginButton.disabled = false;
                loginButton.classList.remove('loading');
                loginButton.textContent = 'Sign In';
            }
        });
    }

    /**
     * Show Error Message
     */
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');

            // Hide after 5 seconds
            setTimeout(() => {
                hideMessage(errorMessage);
            }, 5000);
        }
    }

    /**
     * Show Success Message
     */
    function showSuccess(message) {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.classList.add('show');
        }
    }

    /**
     * Hide Message
     */
    function hideMessage(element) {
        if (element) {
            element.classList.remove('show');
        }
    }

    /**
     * Validate Email Format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Check if User is Already Logged In
     * Redirect to dashboard if logged in
     */
    const checkAuthStatus = () => {
        const token = localStorage.getItem('authToken');
        const currentPath = window.location.pathname;

        // If on login page and already logged in, redirect to dashboard
        if (token && currentPath.includes('loginPage.html')) {
            window.location.href = '../dashboard/dashboard.html';
        }
    };

    checkAuthStatus();

});

/**
 * Logout Function
 * Can be called from dashboard or other pages
 */
function logout() {
    // Clear stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Redirect to login page
    window.location.href = '../login/loginPage.html';
}

/**
 * Get Stored User Information
 * Returns user object from local storage
 */
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Get Authentication Token
 * Returns stored JWT token
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Check if User is Authenticated
 * Returns true if user has valid token
 */
function isAuthenticated() {
    return !!getAuthToken();
}

/**
 * Protected Page Check
 * Redirect to login if not authenticated
 * Call this function on protected pages
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '../login/loginPage.html';
    }
}
