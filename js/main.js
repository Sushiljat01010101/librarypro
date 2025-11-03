const storageManager = new StorageManager();

storageManager.applyTheme();

storageManager.checkForMissedBackups();

storageManager.checkAndPerformScheduledBackup();

setInterval(() => {
    storageManager.checkAndPerformScheduledBackup();
}, 60 * 60 * 1000);

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

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const overlay = document.getElementById('menuOverlay');
    
    if (sidebar && mobileToggle) {
        sidebar.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        if (overlay) {
            overlay.classList.toggle('active');
        }
        
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

const menuOverlay = document.getElementById('menuOverlay');
if (menuOverlay) {
    menuOverlay.addEventListener('click', toggleMobileMenu);
}

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            const overlay = document.getElementById('menuOverlay');
            
            if (sidebar) sidebar.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

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

function updateLibraryName() {
    const settings = storageManager.getSettings();
    let libraryName = settings.libraryName || 'My Library';
    
    libraryName = String(libraryName).trim();
    if (libraryName.length === 0) {
        libraryName = 'My Library';
    }
    
    const logoElements = document.querySelectorAll('.logo');
    logoElements.forEach(logo => {
        logo.textContent = `📚 ${libraryName}`;
    });
    
    const mobileLibraryName = document.querySelector('.mobile-library-name');
    if (mobileLibraryName) {
        mobileLibraryName.textContent = `📚 ${libraryName}`;
    }
    
    const loginTitle = document.querySelector('.logo-section h1');
    if (loginTitle) {
        loginTitle.textContent = libraryName;
    }
    
    const pageTitle = document.querySelector('title');
    if (pageTitle && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        const currentTitle = pageTitle.textContent;
        const parts = currentTitle.split(' - ');
        if (parts.length > 1) {
            pageTitle.textContent = `${parts[0]} - ${libraryName}`;
        }
    } else if (pageTitle && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        pageTitle.textContent = `${libraryName} - Login`;
    }
}

if (typeof storageManager !== 'undefined') {
    updateLibraryName();
}