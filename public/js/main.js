document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management
    // Function to handle the theme update
    function toggleTheme() {
        let theme = document.documentElement.getAttribute("data-theme");
        const themeToggleBtns = document.querySelectorAll('#theme-toggle');
        
        if (theme == "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
            themeToggleBtns.forEach(btn => btn.innerHTML = "🌙");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeToggleBtns.forEach(btn => btn.innerHTML = "☀️");
        }
    }

    // Initialize theme based on saved preference or OS preference
    const currentTheme = localStorage.getItem("theme");
    const themeToggleBtns = document.querySelectorAll('#theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (currentTheme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggleBtns.forEach(btn => btn.innerHTML = "☀️");
    } else if (currentTheme == "light") {
        document.documentElement.setAttribute("data-theme", "light");
        themeToggleBtns.forEach(btn => btn.innerHTML = "🌙");
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggleBtns.forEach(btn => btn.innerHTML = "☀️");
    }

    // Add event listeners for all theme toggle buttons (in navbar or settings)
    themeToggleBtns.forEach(btn => {
        // remove old listeners if any by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener("click", toggleTheme);
    });

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

    // 4. Form Validation & Navigation (Mocked)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const isSearch = form.classList.contains('allow-submit');
            if(!isSearch && form.getAttribute('data-redirect')) {
                e.preventDefault();
                
                // Extra check for password confirm if it exists
                const passwords = form.querySelectorAll('input[type="password"]');
                if (passwords.length >= 2 && passwords[0].value !== passwords[1].value) {
                    alert("Passwords do not match!");
                    return;
                }

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
                            window.location.href = form.getAttribute('data-redirect');
                        }, 800);
                    }, 800);
                }
            } else if (!form.action.includes('.html') && !isSearch) {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                if(btn) {
                    const originalText = btn.innerText;
                    btn.innerText = 'Processing...';
                    setTimeout(() => {
                        btn.innerText = 'Sent successfully!';
                        btn.style.background = 'var(--success)';
                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.background = '';
                            form.reset();
                        }, 1500);
                    }, 800);
                }
            }
        });
    });

    // 5. Smooth Scroll for Anchor Links
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

    // 6. Progress Bar Animations
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-bar-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            if(targetWidth) {
                bar.style.width = targetWidth;
            }
        });
    }, 200);
});
