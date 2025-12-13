console.log("Bin Monitoring Screen Loaded");

// You can add search, filters & map API here
const dateEl = document.getElementById('current-date');
const timeEl = document.getElementById('current-time');

function updateDateTime() {
    const now = new Date();
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString(undefined, {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit', // Added second counting
            hour12: true
        });
    }
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Upload Photo Preview + persist as data URL
const _profilePicEl = document.getElementById('profile-pic');
if (_profilePicEl) {
    // Load profile image from local storage if present
    const storedImg = localStorage.getItem('wastemon_profile_image');
    if (storedImg) {
        _profilePicEl.style.backgroundImage = `url(${storedImg})`;
    } else {
        _profilePicEl.style.backgroundImage = 'url(assets/default-profile.svg)';
    }
}
// Autofill username from local/session storage if available
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('wastemon_user') || sessionStorage.getItem('wastemon_user');
    if (username && document.getElementById('username')) {
        document.getElementById('username').textContent = username;
    }
}); 
