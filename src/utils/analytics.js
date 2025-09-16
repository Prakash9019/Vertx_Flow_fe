import {API_URL} from "../../key";
class AnalyticsAPI {
  constructor() {
    this.baseURL = `${API_URL}`;
    this.userUUID = localStorage.getItem('reachlink-user-uuid') || null;
    this.sessionId = localStorage.getItem('reachlink-session-id') || null;
    console.log(this.userUUID, this.sessionId);
    console.log('AnalyticsAPI initialized with baseURL:', this.baseURL);
    // Ensure userUUID exists
    if (!this.userUUID) {
      this.userUUID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('reachlink-user-uuid', this.userUUID);
    }

    // Ensure sessionId exists
    if (!this.sessionId) {
      this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('reachlink-session-id', this.sessionId);
    }
  }

  /**
   * Initializes a new session or visit.
   * Sends user profile data to the backend if provided (e.g., from Google Sign-In).
   * @param {object} profileData - Optional object with user details like name, email, googleId.
   */
  initSession(profileData = {}) {
    // Combine the user's UUID with any provided profile data
    const body = {
      userUUID: this.userUUID,
      ...profileData
    };

    fetch(`${this.baseURL}/api/track/visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-UUID': this.userUUID,
        'X-Session-ID': this.sessionId,
      },
      // The body now contains all user information
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(data => {
        // console.log('Session initialized:', data);
      }).catch(err => console.error('Session init failed:', err));
  }
    
      async submitFeedback(score, message) {
        const res = await fetch(`${this.baseURL}/api/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-UUID': this.userUUID,
            'X-Session-ID': this.sessionId
          },
          body: JSON.stringify({ score, message })
        });
        return res.json();
      }
    
      async getAnalytics() {
        const res = await fetch(`${this.baseURL}/api/analytics`);
        return res.json();
      }
      async getUserDetails(userUUID) {
        // console.log(userUUID);
        const res = await fetch(`${this.baseURL}/api/analytics/user/${userUUID}`);
        // console.log(res.json());
        return res.json();
      }

      async getUserSummary() {
        const res = await fetch(`${this.baseURL}/api/analytics/user-summary`);
        return res.json();
      }

      async getAllFeedback() {
        const res = await fetch(`${this.baseURL}/api/analytics/all-feedback`);
        return res.json();
      }

      async getAllSessions() {
        const res = await fetch(`${this.baseURL}/api/analytics/all-sessions`);
        return res.json();
      }
      
    }
    
    const analytics = new AnalyticsAPI();
    export default analytics;
    