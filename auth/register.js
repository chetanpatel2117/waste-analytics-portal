// Helper: show inline banner/message
function showRegisterMessage(text, type = 'info') {
    const el = document.getElementById('register-message');
    if (!el) { alert(text); return; }
    el.style.display = 'block';
    el.textContent = text;
    el.style.color = type === 'error' ? '#ff7777' : '#b7ffcc';
}

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const fullname = document.getElementById('reg-fullname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;
    const confirmPass = document.getElementById('reg-password-confirm').value;

    // Simple client-side validation
    if (!fullname || !email || !pass || !confirmPass) {
        showRegisterMessage('All fields are required.', 'error');
        return;
    }
    if (pass !== confirmPass) {
        showRegisterMessage('Passwords do not match.', 'error');
        return;
    }
    
    // Derive username from email when not present in form
    const username = email ? email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase() : '';

    // POST to PHP API
    fetch('../api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullname, email, password: pass })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Registration succeeded — redirect user to the login page (no auto-login)
            showRegisterMessage('Account created successfully! Redirecting to login...', 'success');
            setTimeout(() => window.location.href = 'login.html', 1000);
        } else {
            showRegisterMessage(data.message || 'Registration failed.', 'error');
        }
    })
    .catch(err => {
        console.error('Registration error:', err);
        showRegisterMessage('Registration failed. Check server connection.', 'error');
    });
});

// Password visibility toggles
document.querySelectorAll('.toggle-password').  forEach(btn => {
    btn.addEventListener('click', function () {
        const inputId = this.getAttribute('data-target');
        const input = document.getElementById(inputId);
        if (input) {
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = 'Hide';
            } else {
                input.type = 'password';
                this.textContent = 'Show';
            }
        }
    });
}); 
