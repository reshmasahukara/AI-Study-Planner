const API_BASE = '/api';

// For demonstration, we use a fixed demo user
const DEMO_USER_ID = 1;

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'API Request Failed');
        }
        return await response.json();
    } catch (error) {
        console.error('API Call Failed:', error);
        throw error;
    }
}

// Ensure the page knows who the user is
window.USER_ID = DEMO_USER_ID;
