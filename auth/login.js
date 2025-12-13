// Helper to show an inline banner message
function showLoginMessage(text, type = 'info') {
    const el = document.getElementById('login-error');
    if (!el) { alert(text); return; }
    el.style.display = 'block';
    el.textContent = text;
    el.style.color = type === 'error' ? '#ff7777' : '#b7ffcc';
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const remember = document.getElementById('remember') ? document.getElementById('remember').checked : false;

    // Simple client-side validation
    if (!user || !pass) {
        showLoginMessage('Please enter both username/email and password.', 'error');
        return;
    }

    // POST to PHP API
    fetch('../api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Store auth flag and user details
            const usernameToStore = data.user.username || user;
            const fullnameToStore = data.user.fullname || usernameToStore;
            const emailToStore = data.user.email || '';
            if (remember) {
                localStorage.setItem('wastemon_auth', 'true');
                localStorage.setItem('wastemon_user', usernameToStore);
                localStorage.setItem('wastemon_fullname', fullnameToStore);
                localStorage.setItem('wastemon_email', emailToStore);
            } else {
                sessionStorage.setItem('wastemon_auth', 'true');
                sessionStorage.setItem('wastemon_user', usernameToStore);
                sessionStorage.setItem('wastemon_fullname', fullnameToStore);
                sessionStorage.setItem('wastemon_email', emailToStore);
            }
            showLoginMessage('Login successful. Redirecting...', 'success');
            setTimeout(() => window.location.href = '../dashboard.html', 700);
        } else {
            showLoginMessage(data.message || 'Invalid credentials.', 'error');
        }
    })
    .catch(err => {
        console.error('Login error:', err);
        showLoginMessage('Login failed. Check server connection.', 'error');
    });
});

