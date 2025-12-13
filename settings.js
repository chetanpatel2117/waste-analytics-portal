// Profile Image elements (may not exist on all pages)
const _profileImageEl = document.getElementById('profileImage');
const _photoUploadEl = document.getElementById('photoUpload');
const _changePhotoBtn = document.getElementById('changePhotoBtn');
const _removePhotoBtn = document.getElementById('removePhotoBtn');

// Change Photo Button
if (_changePhotoBtn && _photoUploadEl) {
    _changePhotoBtn.addEventListener('click', () => _photoUploadEl.click());
}

// Upload Photo Preview + persist as data URL
if (_photoUploadEl && _profileImageEl) {
    _photoUploadEl.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            _profileImageEl.src = dataUrl;
            try { localStorage.setItem('wastemon_profile_image', dataUrl); } catch (err) { console.warn('Could not save profile image to localStorage', err); }
        };
        reader.readAsDataURL(file);
    });
}

// Remove Photo
if (_removePhotoBtn && _profileImageEl) {
    _removePhotoBtn.addEventListener('click', () => {
        _profileImageEl.src = 'assets/default-profile.svg';
        localStorage.removeItem('wastemon_profile_image');
    });
}

// Autofill personal details from local/session storage if available
document.addEventListener('DOMContentLoaded', function () {
    const fullname = localStorage.getItem('wastemon_fullname') || sessionStorage.getItem('wastemon_fullname');
    const email = localStorage.getItem('wastemon_email') || sessionStorage.getItem('wastemon_email');
    if (fullname) {
        const fn = document.getElementById('fullName');
        if (fn) fn.value = fullname;
    }
    if (email) {
        const em = document.getElementById('email');
        if (em) em.value = email;
    }

    // Restore profile image from local storage if present
    if (_profileImageEl) {
        const storedImg = localStorage.getItem('wastemon_profile_image');
        if (storedImg) {
            _profileImageEl.src = storedImg;
        }
    }
});

// Auth guard and logout handler (used in settings page)
function _isAuthenticated() {
    return sessionStorage.getItem('wastemon_auth') === 'true' || localStorage.getItem('wastemon_auth') === 'true';
}
function _getAuthUser() {
    return localStorage.getItem('wastemon_user') || sessionStorage.getItem('wastemon_user') || null;
}
function _logoutRedirect() {
    sessionStorage.removeItem('wastemon_auth');
    sessionStorage.removeItem('wastemon_user');
    localStorage.removeItem('wastemon_auth');
    localStorage.removeItem('wastemon_user');
    window.location.href = 'auth/login.html';
}

document.querySelectorAll('.logout-btn').forEach(b => b.addEventListener('click', function(e){ e.preventDefault(); _logoutRedirect(); }));

// On load guard and set username
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname.toLowerCase();
    if (!_isAuthenticated() && !path.includes('/auth/login.html') && !path.includes('/auth/register.html') && !path.includes('/api/')) {
        window.location.href = 'auth/login.html';
        return;
    }
    if (_isAuthenticated()) {
        const name = _getAuthUser();
        const el = document.getElementById('username');
        if (el && name) el.textContent = name;
    }
});
