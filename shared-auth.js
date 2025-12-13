// Shared auth utilities for site: logout, page guard, and user display
(function () {
    function isAuthenticated() {
        return sessionStorage.getItem('wastemon_auth') === 'true' || localStorage.getItem('wastemon_auth') === 'true';
    }
    function getAuthUser() {
        return localStorage.getItem('wastemon_user') || sessionStorage.getItem('wastemon_user') || null;
    }
    function getAuthFullName() {
        return localStorage.getItem('wastemon_fullname') || sessionStorage.getItem('wastemon_fullname') || null;
    }
    function getAuthEmail() {
        return localStorage.getItem('wastemon_email') || sessionStorage.getItem('wastemon_email') || null;
    }
    function logoutRedirect() {
        sessionStorage.removeItem('wastemon_auth');
        sessionStorage.removeItem('wastemon_user');
        localStorage.removeItem('wastemon_auth');
        localStorage.removeItem('wastemon_user');
        window.location.href = 'auth/login.html';
    }

    // Wire logout buttons
    document.querySelectorAll('.logout-btn').forEach(b => b.addEventListener('click', function (e) {
        e && e.preventDefault();
        logoutRedirect();
    }));

    // Guard pages and show username
    document.addEventListener('DOMContentLoaded', function () {
        const path = window.location.pathname.toLowerCase();
        const onLoginPage = path.includes('/auth/login.html');
        const onRegisterPage = path.includes('/auth/register.html');
        const isApi = path.includes('/api/');

        if (!isAuthenticated() && !onLoginPage && !onRegisterPage && !isApi) {
            window.location.href = 'auth/login.html';
            return;
        }

        // If a logged-in user is on an auth page, redirect to dashboard
        if (isAuthenticated() && (onLoginPage || onRegisterPage)) {
            window.location.href = '../dashboard.html';
            return;
        }

        if (isAuthenticated()) {
            const name = getAuthFullName() || getAuthUser();
            const el = document.getElementById('username');
            if (el && name) el.textContent = name;

            // If on settings page, autofill details
            if (path.includes('/settings.html')) {
                const fullNameInput = document.getElementById('fullName');
                const emailInput = document.getElementById('email');
                const fullname = getAuthFullName();
                const email = getAuthEmail();
                if (fullNameInput && fullname) fullNameInput.value = fullname;
                if (emailInput && email) emailInput.value = email;
            }
        }
    });
})();
