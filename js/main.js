const storageManager = new StorageManager();

storageManager.applyTheme();

// ============================================================
// Supabase Async Auth — Main Entry Point
// ============================================================
(async () => {
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (isLoginPage) {
        // --- LOGIN PAGE LOGIC ---
        // If already logged in, redirect to dashboard
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                window.location.href = 'dashboard.html';
                return;
            }
        } catch (e) {
            // No session — stay on login page
        }

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                // Show loading state
                submitBtn.disabled = true;
                submitBtn.textContent = 'Signing in...';

                const result = await storageManager.loginAsync(email, password);

                if (result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    alert(result.error || 'Invalid email or password!');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }
    } else {
        // --- PROTECTED PAGE LOGIC ---
        const user = await storageManager.checkAuthAsync();
        if (!user) return; // checkAuthAsync already handles redirect

        // Check for scheduled backups (fire-and-forget, non-blocking)
        storageManager.checkForMissedBackups();
        storageManager.checkAndPerformScheduledBackup();
        setInterval(() => {
            storageManager.checkAndPerformScheduledBackup();
        }, 60 * 60 * 1000);

        // Dynamic Admin Panel sidebar button visibility
        const isAdmin = await storageManager.isAdmin();
        if (isAdmin) {
            const adminLinks = document.querySelectorAll('.admin-panel-link');
            adminLinks.forEach(link => {
                link.style.display = '';
            });
        }

        // Update user name in header
        const currentUserEl = document.getElementById('currentUser');
        if (currentUserEl) {
            currentUserEl.textContent = storageManager.getUser().name;
        }
    }
})();

// ============================================================
// Sidebar Toggle & Mobile Menu (unchanged from original)
// ============================================================
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

// ============================================================
// Logout Button (uses async Supabase signOut)
// ============================================================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            await storageManager.logoutAsync();
        }
    });
}

// ============================================================
// Modal Helpers (unchanged)
// ============================================================
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

// ============================================================
// Header Info (unchanged)
// ============================================================
const currentDate = document.getElementById('currentDate');
if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
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