storageManager.checkAuth();

function loadActivities() {
    const activities = storageManager.getActivities();
    const searchTerm = document.getElementById('searchActivity').value.toLowerCase();
    const actionFilter = document.getElementById('actionFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let filtered = activities.filter(activity => {
        const matchesSearch = activity.text.toLowerCase().includes(searchTerm);
        
        let matchesAction = true;
        if (actionFilter !== 'all') {
            matchesAction = activity.type === actionFilter;
        }
        
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const activityDate = new Date(activity.timestamp);
            const now = new Date();
            
            if (dateFilter === 'today') {
                matchesDate = activityDate.toDateString() === now.toDateString();
            } else if (dateFilter === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = activityDate >= weekAgo;
            } else if (dateFilter === 'month') {
                const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                matchesDate = activityDate >= monthAgo;
            }
        }
        
        return matchesSearch && matchesAction && matchesDate;
    });
    
    const container = document.getElementById('activityTimeline');
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-data">No activities found.</div>';
        return;
    }
    
    const groupedByDate = {};
    filtered.forEach(activity => {
        const date = new Date(activity.timestamp).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        if (!groupedByDate[date]) {
            groupedByDate[date] = [];
        }
        groupedByDate[date].push(activity);
    });
    
    let html = '';
    Object.keys(groupedByDate).forEach(date => {
        html += `
            <div class="timeline-date">
                <h3>${date}</h3>
            </div>
        `;
        
        groupedByDate[date].forEach(activity => {
            const icon = getActivityIcon(activity.type);
            const time = new Date(activity.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            html += `
                <div class="timeline-item ${activity.type}">
                    <div class="timeline-marker">${icon}</div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="timeline-type">${activity.type}</span>
                            <span class="timeline-time">${time}</span>
                        </div>
                        <div class="timeline-text">${activity.text}</div>
                        <div class="timeline-user">by ${activity.user}</div>
                    </div>
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
}

function getActivityIcon(type) {
    const icons = {
        member: '👤',
        book: '📚',
        fee: '💰',
        expense: '💸',
        system: '⚙️'
    };
    return icons[type] || '📋';
}

document.getElementById('exportLogBtn').addEventListener('click', () => {
    const activities = storageManager.getActivities();
    const exportData = activities.map(a => ({
        Date: new Date(a.timestamp).toLocaleString('en-IN'),
        Type: a.type,
        Action: a.text,
        User: a.user
    }));
    
    storageManager.exportToCSV(exportData, `activity-log-${new Date().toISOString().split('T')[0]}.csv`);
});

document.getElementById('clearLogBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
        if (confirm('Last confirmation! All activity history will be permanently deleted.')) {
            storageManager.clearActivities();
            loadActivities();
            alert('Activity log cleared successfully!');
        }
    }
});

document.getElementById('searchActivity').addEventListener('input', loadActivities);
document.getElementById('actionFilter').addEventListener('change', loadActivities);
document.getElementById('dateFilter').addEventListener('change', loadActivities);

const style = document.createElement('style');
style.textContent = `
    .timeline-date {
        margin: 30px 0 15px;
        padding: 10px 0;
        border-bottom: 2px solid var(--primary-gold);
    }
    
    .timeline-date h3 {
        color: var(--primary-gold);
        font-size: 16px;
    }
    
    .timeline-item {
        display: flex;
        gap: 15px;
        margin: 15px 0;
        padding: 15px;
        background: var(--bg-card);
        border-radius: 8px;
        border-left: 3px solid var(--border-color);
        transition: all 0.3s ease;
    }
    
    .timeline-item:hover {
        border-left-color: var(--primary-gold);
        transform: translateX(5px);
    }
    
    .timeline-item.member {
        border-left-color: #4caf50;
    }
    
    .timeline-item.book {
        border-left-color: #9c27b0;
    }
    
    .timeline-item.fee {
        border-left-color: var(--primary-gold);
    }
    
    .timeline-item.expense {
        border-left-color: #ff9800;
    }
    
    .timeline-marker {
        font-size: 24px;
        min-width: 30px;
    }
    
    .timeline-content {
        flex: 1;
    }
    
    .timeline-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    
    .timeline-type {
        display: inline-block;
        padding: 3px 10px;
        background: var(--bg-secondary);
        color: var(--primary-gold);
        border-radius: 12px;
        font-size: 11px;
        text-transform: uppercase;
        font-weight: 600;
    }
    
    .timeline-time {
        color: var(--text-muted);
        font-size: 12px;
    }
    
    .timeline-text {
        color: var(--text-secondary);
        font-size: 14px;
        margin-bottom: 5px;
    }
    
    .timeline-user {
        color: var(--text-muted);
        font-size: 12px;
        font-style: italic;
    }
`;
document.head.appendChild(style);

loadActivities();