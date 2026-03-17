/**
 * Global UI Utilities & Toast Notification System
 */
const ui = {
    /**
     * Show a toast notification
     * @param {string} message 
     * @param {string} type 'success' | 'error' | 'info' | 'warning'
     */
    showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-3';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const colors = {
            success: 'border-green-500/50 bg-green-500/10 text-green-400',
            error: 'border-red-500/50 bg-red-500/10 text-red-400',
            warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
            info: 'border-blue-500/50 bg-blue-500/10 text-blue-400'
        };
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-triangle-exclamation',
            info: 'fa-info-circle'
        };

        toast.className = `glass-card px-6 py-4 border-l-4 ${colors[type]} flex items-center gap-4 animate-slide-in-right min-w-[300px] shadow-2xl`;
        toast.style.marginBottom = '0';
        toast.innerHTML = `
            <i class="fas ${icons[type]} text-lg"></i>
            <div class="flex-1">
                <p class="text-[11px] font-black uppercase tracking-widest opacity-60 mb-0.5">${type}</p>
                <p class="text-sm font-semibold">${message}</p>
            </div>
            <button class="text-white/20 hover:text-white transition">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        // Auto remove
        const timer = setTimeout(() => {
            this.hideToast(toast);
        }, 5000);

        toast.querySelector('button').onclick = () => {
            clearTimeout(timer);
            this.hideToast(toast);
        };
    },

    hideToast(toast) {
        toast.classList.remove('animate-slide-in-right');
        toast.classList.add('animate-slide-out-right');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }
};

// Add required animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in-right {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slide-out-right {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-slide-out-right { animation: slide-out-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
`;
document.head.appendChild(style);

window.ui = ui;

// Add page transition
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (main) {
        main.classList.add('page-transition');
    }
    
    // Global Link Handling for smooth exits (Optional but nice)
    document.querySelectorAll('a[href]').forEach(link => {
        if (link.hostname === window.location.hostname && !link.hash && !link.target) {
            link.addEventListener('click', (e) => {
                if (main) {
                    e.preventDefault();
                    main.style.opacity = '0';
                    main.style.transform = 'translateY(-10px)';
                    main.style.transition = 'all 0.3s ease-in';
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 300);
                }
            });
        }
    });
});
