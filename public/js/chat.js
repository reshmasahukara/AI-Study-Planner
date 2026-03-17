/**
 * AI Chat Assistant Logic
 */
class AIChatAssistant {
    constructor() {
        this.form = document.getElementById('chat-form');
        this.input = document.getElementById('chat-input');
        this.container = document.getElementById('chat-container');
        this.toggleBtn = document.getElementById('doubt-solver-toggle');
        this.options = document.getElementById('doubt-solver-options');
        this.mode = 'Default';
        this.isTyping = false;
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleDoubtSolver());
        }
        
        // Expose setMode to global scope for the buttons in HTML
        window.setMode = (m) => this.setMode(m);
    }

    toggleDoubtSolver() {
        this.options.classList.toggle('hidden');
        this.toggleBtn.classList.toggle('bg-purple-500/20');
        this.toggleBtn.innerText = this.options.classList.contains('hidden') ? 'Doubt Solver Mode' : 'Doubt Solver Active';
    }

    setMode(mode) {
        this.mode = mode;
        this.showToast(`Mode switched to: ${mode}`);
        this.input.placeholder = `Explain ${mode === 'Simply' ? 'simply' : mode === 'Exam' ? 'for exams' : 'with examples'}...`;
    }

    handleSubmit(e) {
        e.preventDefault();
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        this.input.value = '';
        this.simulateAIResponse(message);
    }

    addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex gap-4 ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`;
        
        const innerHTML = sender === 'user' ? `
            <div class="chat-bubble-user p-4 max-w-[80%] text-sm leading-relaxed text-white">
                ${text}
            </div>
            <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 shrink-0">
                <i class="fas fa-user text-sm"></i>
            </div>
        ` : `
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <i class="fas fa-robot text-sm"></i>
            </div>
            <div class="chat-bubble-ai p-4 max-w-[80%] text-sm leading-relaxed">
                ${text}
            </div>
        `;
        
        msgDiv.innerHTML = innerHTML;
        this.container.querySelector('.max-w-4xl').appendChild(msgDiv);
        this.scrollToBottom();
    }

    simulateAIResponse(query) {
        this.isTyping = true;
        
        // Add typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex gap-4 animate-fade-in';
        typingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <i class="fas fa-robot text-sm"></i>
            </div>
            <div class="chat-bubble-ai p-4 flex gap-1 items-center">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        this.container.querySelector('.max-w-4xl').appendChild(typingDiv);
        this.scrollToBottom();

        // Simulate delay
        setTimeout(() => {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
            const response = this.getMockResponse(query);
            this.addMessage(response, 'ai');
            this.isTyping = false;
        }, 1500);
    }

    getMockResponse(query) {
        const q = query.toLowerCase();
        
        if (this.mode === 'Simply') {
            if (q.includes('bfs')) return "Imagine you are at the center of a group of friends. BFS is like talking to everyone standing right next to you first, then moving to their friends, one layer at a time. It's like ripples in a pond!";
            return "Sure! Think of it like a simplified version. Basically, it means taking one step at a time and making sure you understand the core idea before moving to advanced parts.";
        }
        
        if (this.mode === 'Exam') {
             if (q.includes('bfs')) return "<b>Breadth-First Search (BFS)</b>: An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all nodes at the present depth prior to moving on to nodes at the next depth level. <b>Time Complexity:</b> O(V+E).";
             return "In an exam context, you should focus on defining the term clearly, mentioning key components, and if applicable, stating the complexity or primary use case.";
        }

        if (q.includes('bfs')) return "BFS is used in many ways, like finding the shortest path in an unweighted graph (like GPS for city blocks) or finding all people within a certain 'degree of separation' on social media.";
        if (q.includes('hello') || q.includes('hi')) return "Hi there! I'm ready to help you study. Try asking me to 'Explain BFS' or 'Give study tips'!";
        
        return "That's a great question! Based on your query, I recommend focusing on the fundamental principles first. Would you like me to 'Explain Simply' or 'Give an Example' for this?";
    }

    scrollToBottom() {
        this.container.scrollTo({
            top: this.container.scrollHeight,
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIChatAssistant();
});
