class AuthManager {
    constructor() {
        this.token = localStorage.getItem('jwtToken');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.updateUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
            return;
        }

        try {
            // Auth buttons
            const loginBtn = document.getElementById('login-btn');
            const signupBtn = document.getElementById('signup-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const addRecipeBtn = document.getElementById('add-recipe-btn');

            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAuthModal('login');
                });
            } else {
                console.warn('Login button not found');
            }

            if (signupBtn) {
                signupBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAuthModal('signup');
                });
            } else {
                console.warn('Signup button not found');
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }

            if (addRecipeBtn) {
                addRecipeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleAddRecipeSection();
                });
            }

            // Tab switching
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tab = e.target.dataset.tab;
                    if (tab) {
                        this.switchAuthTab(tab);
                    }
                });
            });

            // Modal controls
            const closeBtn = document.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.hideAuthModal();
                });
            }

            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideAuthModal();
                }
            });

            // Form submissions
            const loginSubmit = document.getElementById('login-submit');
            const signupSubmit = document.getElementById('signup-submit');

            if (loginSubmit) {
                loginSubmit.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }

            if (signupSubmit) {
                signupSubmit.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleSignup();
                });
            }

            // Close modal when clicking outside
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                authModal.addEventListener('click', (e) => {
                    if (e.target.id === 'auth-modal') {
                        this.hideAuthModal();
                    }
                });
            }

            // Enter key for forms
            const loginPassword = document.getElementById('login-password');
            const signupPassword = document.getElementById('signup-password');

            if (loginPassword) {
                loginPassword.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleLogin();
                    }
                });
            }

            if (signupPassword) {
                signupPassword.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleSignup();
                    }
                });
            }

            console.log('Auth event listeners setup complete');
        } catch (error) {
            console.error('Error setting up auth event listeners:', error);
        }
    }

    showAuthModal(formType) {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            this.switchAuthTab(formType);
            console.log('Auth modal shown for:', formType);
        } else {
            console.error('Auth modal element not found');
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
            this.clearAuthForms();
            console.log('Auth modal hidden');
        }
    }

    switchAuthTab(tab) {
        // Update tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update forms
        document.getElementById('login-form').classList.toggle('active', tab === 'login');
        document.getElementById('signup-form').classList.toggle('active', tab === 'signup');
    }

    clearAuthForms() {
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-confirm-password').value = '';
    }

    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        this.showLoading(true);
        console.log('Attempting login for user:', username);

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Login response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful, received data:', data);
                
                this.token = data.token;
                this.user = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    roles: data.roles
                };

                localStorage.setItem('jwtToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                this.hideAuthModal();
                this.updateUI();
                this.showNotification('Login successful! Welcome back!', 'success');

                // Refresh recipes
                if (window.recipeManager) {
                    window.recipeManager.loadRecipes();
                }
            } else {
                const errorText = await response.text();
                console.error('Login failed with status:', response.status, 'Error:', errorText);
                this.showNotification(`Login failed: ${errorText || 'Invalid credentials'}`, 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please check your connection and try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async handleSignup() {
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        this.showLoading(true);
        console.log('Attempting signup for user:', username, 'email:', email);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            console.log('Signup response status:', response.status);

            if (response.ok) {
                const responseText = await response.text();
                console.log('Signup successful:', responseText);
                this.showNotification('Account created successfully! Please sign in.', 'success');
                this.switchAuthTab('login');
                this.clearAuthForms();
            } else {
                const errorText = await response.text();
                console.error('Signup failed with status:', response.status, 'Error:', errorText);
                this.showNotification(`Signup failed: ${errorText || 'Please try again'}`, 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('Signup failed. Please check your connection and try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    logout() {
        this.token = null;
        this.user = {};
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        this.updateUI();
        this.showNotification('Logged out successfully', 'success');

        // Refresh recipes to show public content
        if (window.recipeManager) {
            window.recipeManager.loadRecipes();
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const userMenu = document.getElementById('user-menu');
        const usernameDisplay = document.getElementById('username-display');
        const addRecipeSection = document.getElementById('add-recipe-section');

        if (this.isLoggedIn()) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            usernameDisplay.textContent = this.user.username;
            addRecipeSection.style.display = 'block';
        } else {
            loginBtn.style.display = 'block';
            signupBtn.style.display = 'block';
            userMenu.style.display = 'none';
            addRecipeSection.style.display = 'none';
        }
    }

    toggleAddRecipeSection() {
        const addRecipeSection = document.getElementById('add-recipe-section');
        addRecipeSection.style.display = addRecipeSection.style.display === 'none' ? 'block' : 'none';

        if (addRecipeSection.style.display === 'block') {
            addRecipeSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    isLoggedIn() {
        return this.token !== null;
    }

    getAuthHeader() {
        return this.token ? {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        } : {};
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        // Add icon based on type
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';

        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // Test backend connectivity
    testBackendConnection();
});

async function testBackendConnection() {
    try {
        const response = await fetch('/api/recipes/public');
        if (response.ok) {
            console.log('Backend connection successful');
        } else {
            console.warn('Backend connection issue:', response.status);
        }
    } catch (error) {
        console.error('Backend connection failed:', error);
        // Show a warning to the user
        setTimeout(() => {
            if (window.authManager) {
                window.authManager.showNotification('Unable to connect to server. Please check your connection.', 'warning');
            }
        }, 2000);
    }
}