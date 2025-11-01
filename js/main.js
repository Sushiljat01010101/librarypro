const storageManager = new StorageManager();

if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const loginForm = document.getElementById('loginForm');
    
    if (storageManager.isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            if (storageManager.login(username, password, rememberMe)) {
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username or password!');
            }
        });
    }
} else {
    storageManager.checkAuth();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

const sidebarToggle = document.getElementById('sidebarToggle');
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            storageManager.logout();
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-btn')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

const currentDate = document.getElementById('currentDate');
if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

const currentUser = document.getElementById('currentUser');
if (currentUser) {
    currentUser.textContent = storageManager.getUser().name;
}