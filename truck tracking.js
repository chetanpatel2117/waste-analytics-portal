console.log("Truck Dashboard Loaded Successfully");

// You can add dynamic map, API calls, filters etc.
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

function rowToData(row){
    const cols = row.querySelectorAll('td');
    return {
        truckId: cols[0] ? cols[0].textContent.trim() : '',
        driver: cols[1] ? cols[1].textContent.trim() : '',
        route: cols[2] ? cols[2].textContent.trim() : '',
        status: cols[3] ? cols[3].textContent.trim() : '',
        lastUpdate: cols[4] ? cols[4].textContent.trim() : ''
    };
}

function setStatusDisplay(el, status) {
    // Normalize and set color class
    const s = (status||'').toLowerCase();
    el.textContent = status || '';
    el.classList.remove('bg-green-600/20','text-green-400','status-yellow','status-gray','status-green');
    if (s.includes('route') || s.includes('on route') || s.includes('enroute') || s.includes('on route')){
        el.classList.add('bg-green-600/20','text-green-400','status-green');
    } else if (s.includes('maintenance') || s.includes('idle')) {
        el.classList.add('status-yellow');
    } else if (s.includes('offline') || s.includes('n/a')) {
        el.classList.add('status-gray');
    } else if (s.includes('overflow') || s.includes('critical')){
        el.classList.add('status-yellow');
    } else {
        el.classList.add('status-green');
    }
}

function populateTruckPanel(data) {
    const title = document.getElementById('truck-title');
    const status = document.getElementById('truck-status');
    const driverEl = document.getElementById('driver-value');
    const routeEl = document.getElementById('route-value');
    const speedEl = document.getElementById('speed-value');
    const lastEl = document.getElementById('last-reported-value');
    const nextEl = document.getElementById('next-bin-value');
    const etaEl = document.getElementById('eta-value');

    if (title) title.textContent = data.truckId || 'Truck';
    if (status) setStatusDisplay(status, data.status || '');
    if (driverEl) driverEl.textContent = data.driver || '';
    if (routeEl) routeEl.textContent = data.route || '';
    if (speedEl) speedEl.textContent = data.speed || '';
    if (lastEl) lastEl.textContent = data.lastUpdate || '';
    if (nextEl) nextEl.textContent = data.nextBin || '';
    if (etaEl) etaEl.textContent = data.eta || '';
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Row selection logic
window.addEventListener('DOMContentLoaded', function(){
    const rows = document.querySelectorAll('.truck-table tbody tr');
    if(!rows || rows.length === 0) return;

    function clearSelection(){
        rows.forEach(r => r.classList.remove('selected'));
    }

    rows.forEach((r, idx) => {
        r.addEventListener('click', function(){
            clearSelection();
            r.classList.add('selected');
            const data = rowToData(r);
            populateTruckPanel(data);
        });

        // Auto-select first row
        if(idx === 0){
            r.classList.add('selected');
            const data = rowToData(r);
            populateTruckPanel(data);
        }
    });
});

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