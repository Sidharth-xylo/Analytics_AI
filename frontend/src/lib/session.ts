/**
 * Session Management Utility
 * Generates and manages unique session IDs for each browser
 * Session IDs are stored in localStorage and persist across page refreshes
 */

const SESSION_KEY = 'analytics_session_id';

/**
 * Generates a UUID v4
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Gets the current session ID from localStorage or creates a new one
 * @returns Session ID (UUID)
 */
export function getSessionId(): string {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
        return 'server-side-render';
    }

    // Try to get existing session ID
    let sessionId = localStorage.getItem(SESSION_KEY);

    // If no session ID exists, create a new one
    if (!sessionId) {
        sessionId = generateUUID();
        localStorage.setItem(SESSION_KEY, sessionId);
        console.log('New session created:', sessionId);
    }

    return sessionId;
}

/**
 * Clears the current session (useful for testing or logout)
 */
export function clearSession(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_KEY);
    }
}
