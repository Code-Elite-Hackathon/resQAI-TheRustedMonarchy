// src/services/api.js

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * A helper function to handle fetch requests and JSON parsing.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<any>} - The JSON response.
 */
const fetchJson = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};

export const api = {
    getIncidents: () => fetchJson(`${API_BASE_URL}/incidents`),
    getResources: () => fetchJson(`${API_BASE_URL}/resources`),
    // --- CORRECTED LINE ---
    getEvents: () => fetchJson(`${API_BASE_URL}/events`),
    createIncident: (incidentData) => fetchJson(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData),
    }),
    dispatchUnit: (incidentId, resourceId) => fetchJson(`${API_BASE_URL}/incidents/${incidentId}/dispatch/${resourceId}`, {
        method: 'POST',
    }),
    recallUnit: (incidentId, resourceId) => fetchJson(`${API_BASE_URL}/incidents/${incidentId}/recall/${resourceId}`, {
        method: 'POST',
    }),
};