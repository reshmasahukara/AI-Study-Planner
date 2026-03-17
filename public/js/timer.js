/**
 * Pomodoro Timer Logic
 */
class PomodoroTimer {
    constructor() {
        this.timerDisplay = document.getElementById('timer-clock');
        this.statusDisplay = document.getElementById('timer-status');
        this.sessionCountDisplay = document.getElementById('session-count');
        
        this.startButton = document.getElementById('timer-start');
        this.pauseButton = document.getElementById('timer-pause');
        this.resetButton = document.getElementById('timer-reset');

        this.timeLeft = 25 * 60; // 25 minutes
        this.timerId = null;
        this.isPaused = true;
        this.currentMode = 'Work'; // Work, Short Break, Long Break
        this.sessionsCompleted = 0;

        this.init();
    }

    init() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.start());
            this.pauseButton.addEventListener('click', () => this.pause());
            this.resetButton.addEventListener('click', () => this.reset());
        }
        this.updateDisplay();
    }

    start() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.startButton.classList.add('hidden');
        this.pauseButton.classList.remove('hidden');

        this.timerId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateDisplay();
            } else {
                this.finishSession();
            }
        }, 1000);
    }

    pause() {
        this.isPaused = true;
        clearInterval(this.timerId);
        this.startButton.classList.remove('hidden');
        this.pauseButton.classList.add('hidden');
    }

    reset() {
        this.pause();
        this.currentMode = 'Work';
        this.timeLeft = 25 * 60;
        this.updateDisplay();
    }

    finishSession() {
        this.pause();
        
        if (this.currentMode === 'Work') {
            this.sessionsCompleted++;
            this.sessionCountDisplay.innerText = this.sessionsCompleted;
            
            if (this.sessionsCompleted % 4 === 0) {
                this.currentMode = 'Long Break';
                this.timeLeft = 15 * 60;
                this.notify("Time for a long break (15 min)!");
            } else {
                this.currentMode = 'Short Break';
                this.timeLeft = 5 * 60;
                this.notify("Time for a quick break (5 min)!");
            }
        } else {
            this.currentMode = 'Work';
            this.timeLeft = 25 * 60;
            this.notify("Break over! Time to focus.");
        }
        
        this.updateDisplay();
    }

    updateDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        if (this.timerDisplay) {
            this.timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        if (this.statusDisplay) {
            this.statusDisplay.innerText = this.currentMode === 'Work' ? 'Work Session' : this.currentMode;
        }
    }

    notify(message) {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("PlanIt AI Timer", { body: message });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification("PlanIt AI Timer", { body: message });
                    }
                });
            }
        }
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('timer-clock')) {
        new PomodoroTimer();
    }
});
