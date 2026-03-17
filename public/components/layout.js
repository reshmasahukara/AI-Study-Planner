document.addEventListener('DOMContentLoaded', () => {
    // Determine and apply theme early
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const isAppPage = window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html');

    if (isAppPage) {
        setupAppLayout();
    }
});

function setupAppLayout() {
    const currentPath = window.location.pathname.split('/').pop() || 'planner.html';
    
    const sidebarHtml = `
        <aside class="sidebar">
            <div class="sidebar-logo">AI Planner.</div>
            <ul class="nav-links">
                <li><a href="/planner.html" class="${currentPath === 'planner.html' ? 'active' : ''}">
                    <span style="font-size: 1.2rem;">🎯</span> Set Goals
                </a></li>
                <li><a href="/schedule.html" class="${currentPath === 'schedule.html' ? 'active' : ''}">
                    <span style="font-size: 1.2rem;">📅</span> Daily Schedule
                </a></li>
                <li><a href="/dashboard.html" class="${currentPath === 'dashboard.html' ? 'active' : ''}">
                    <span style="font-size: 1.2rem;">📊</span> Progress
                </a></li>
                <li><a href="/settings.html" class="${currentPath === 'settings.html' ? 'active' : ''}">
                    <span style="font-size: 1.2rem;">⚙️</span> Settings
                </a></li>
            </ul>
            <div class="theme-toggle">
                <button id="themeToggleBtn" class="btn btn-outline" style="width: 100%; border-radius: 12px;">Toggle Theme 🌓</button>
            </div>
        </aside>
    `;

    const mainContent = document.body.innerHTML;
    document.body.innerHTML = `
        <div id="app-layout">
            ${sidebarHtml}
            <main class="main-content">
                ${mainContent}
            </main>
        </div>
    `;

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}
