/**
 * Auth Logic handler
 */
class AuthManager {
    constructor() {
        this.signupForm = document.getElementById('registration-form');
        this.otpForm = document.getElementById('otp-form');
        this.loginForm = document.querySelector('form[action="dashboard.html"]'); // Simplified for current login structure
        this.countdown = 119; // 1:59 in seconds
        this.timerInterval = null;
        
        this.init();
    }

    init() {
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }
        if (this.otpForm) {
            this.otpForm.addEventListener('submit', (e) => this.handleOTPVerification(e));
        }
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            this.prefillLogin();
        }
        
        // Handle Resend button
        const resendBtn = document.getElementById('resend-btn');
        if (resendBtn) {
            resendBtn.addEventListener('click', () => this.resendOTP());
        }
    }

    // --- Signup Flow ---
    handleRegistration(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const name = document.getElementById('signup-name').value;
        
        // Mock sending OTP
        console.log(`Sending OTP to ${email}`);
        
        // Transition to OTP step
        document.getElementById('signup-step').classList.add('step-hidden');
        document.getElementById('otp-step').classList.remove('step-hidden');
        document.getElementById('otp-step').classList.add('fade-in');
        document.getElementById('display-email').innerText = email;
        
        this.startOTPTimer();
    }

    startOTPTimer() {
        this.countdown = 119;
        const timerDisplay = document.getElementById('timer-val');
        const resendBtn = document.getElementById('resend-btn');
        
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            const minutes = Math.floor(this.countdown / 60);
            const seconds = this.countdown % 60;
            timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.countdown <= 0) {
                clearInterval(this.timerInterval);
                resendBtn.disabled = false;
                resendBtn.classList.remove('text-gray-600', 'cursor-not-allowed');
                resendBtn.classList.add('text-blue-400', 'hover:underline', 'cursor-pointer');
            }
            this.countdown--;
        }, 1000);
    }

    resendOTP() {
        this.showToast("New OTP sent to your email!");
        this.startOTPTimer();
        
        const resendBtn = document.getElementById('resend-btn');
        resendBtn.disabled = true;
        resendBtn.classList.add('text-gray-600', 'cursor-not-allowed');
        resendBtn.classList.remove('text-blue-400', 'hover:underline', 'cursor-pointer');
    }

    handleOTPVerification(e) {
        e.preventDefault();
        const inputs = document.querySelectorAll('.otp-input');
        const otp = Array.from(inputs).map(i => i.value).join('');
        
        if (otp.length < 6) {
            alert("Please enter full 6-digit OTP.");
            return;
        }

        // Mock verification
        this.showToast("Account Verified Successfully!");
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }

    // --- Login Flow ---
    handleLogin(e) {
        const rememberMe = document.getElementById('remember-me')?.checked;
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (rememberMe) {
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
            localStorage.setItem('rememberMe', 'false');
        }
    }

    prefillLogin() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
            const emailInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');
            const check = document.getElementById('remember-me');
            
            if (emailInput) emailInput.value = localStorage.getItem('savedEmail') || '';
            if (passInput) passInput.value = localStorage.getItem('savedPassword') || '';
            if (check) check.checked = true;
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = message;
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, -20px)';
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translate(-50%, 10px)';
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});
