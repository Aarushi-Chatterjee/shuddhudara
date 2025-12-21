// registerHandler.js - Frontend Registration Logic
// Handles registration form submission and API communication

// API Base URL
// API Base URL - Dynamic based on environment
// API Base URL - Relative path works for both local and production when served from same origin
const API_URL = '/api/auth';

document.addEventListener('DOMContentLoaded', function () {

    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerButton = document.getElementById('registerButton');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const passwordToggle = document.getElementById('passwordToggle');

    // Toggle Password Visibility
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }

    // Handle Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Clear messages
            hideMessage(errorMessage);
            hideMessage(successMessage);

            // Get values
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            if (!username || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            // Disable button
            registerButton.disabled = true;
            registerButton.classList.add('loading');
            registerButton.textContent = 'Creating Account...';

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                // Attempt to parse JSON response
                let data;
                try {
                    data = await response.json();
                } catch (parseError) {
                    // Response was likely HTML (error page) on 500/404
                    console.error('JSON Parse Error:', parseError);
                    throw new Error(`Server Error: ${response.status} ${response.statusText}`);
                }

                if (response.ok && data.success) {
                    showSuccess('Account created successfully! Redirecting to dashboard...');

                    // Store token
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Redirect
                    setTimeout(() => {
                        window.location.href = '/dashboard/dashboard.html';
                    }, 1500);

                } else {
                    showError(data.message || 'Registration failed');
                }

            } catch (error) {
                console.error('Registration error:', error);
                // Show specific error message if available
                const msg = error.message.includes('Server Error')
                    ? error.message
                    : 'Connection error. Please ensure backend is running.';
                showError(msg);
            }
            finally {
                registerButton.disabled = false;
                registerButton.classList.remove('loading');
                registerButton.textContent = 'Create Account';
            }
        });
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
            setTimeout(() => hideMessage(errorMessage), 5000);
        }
    }

    function showSuccess(message) {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.classList.add('show');
        }
    }

    function hideMessage(element) {
        if (element) element.classList.remove('show');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
