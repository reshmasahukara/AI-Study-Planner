document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Initialize theme
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if(themeToggleBtn) themeToggleBtn.innerHTML = "☀️";
    } else if (currentTheme == "light") {
        document.documentElement.setAttribute("data-theme", "light");
        if(themeToggleBtn) themeToggleBtn.innerHTML = "🌙";
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute("data-theme", "dark");
        if(themeToggleBtn) themeToggleBtn.innerHTML = "☀️";
    }

    // Toggle theme
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            if (theme == "dark") {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
                themeToggleBtn.innerHTML = "🌙";
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
                themeToggleBtn.innerHTML = "☀️";
            }
        });
    }

    // 2. Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '✖' : '☰';
        });
    }

    // 3. Sidebar Toggle (Dashboard)
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if(sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // 4. Progress Bar Animations
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    if (progressBars.length > 0) {
        // Delay animation slightly for effect
        setTimeout(() => {
            progressBars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width');
                if(targetWidth) {
                    bar.style.width = targetWidth;
                }
            });
        }, 300);
    }

    // 5. Form Mocks (Prevent default submission for demonstration)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const isSearch = form.classList.contains('allow-submit');
            if(!isSearch && !form.action.includes('.html')) {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                if(btn) {
                    const originalText = btn.innerText;
                    btn.innerText = 'Processing...';
                    setTimeout(() => {
                        btn.innerText = 'Success!';
                        btn.style.background = 'var(--success)';
                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.background = '';
                            if (form.getAttribute('data-redirect')) {
                                window.location.href = form.getAttribute('data-redirect');
                            }
                        }, 1000);
                    }, 1000);
                }
            }
        });
    });

    // 6. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
