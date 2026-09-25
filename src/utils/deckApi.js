import axios from 'axios';
import api, { API_URL } from './api';

// A raw `axios.post`, not the shared `api` instance: `api` forces
// `Content-Type: application/json` on every request, which would strip the
// multipart boundary FormData needs for the backend's file-upload middleware
// to parse it. Leaving Content-Type unset lets the browser generate the
// correct multipart header (with boundary) itself.
export function uploadAsset(file) {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return axios
    .post(`${API_URL}/files/deck-asset`, formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    .then((response) => response.data.url);
}

export const deckApi = {
  createDeck: (deck) => api.post('/decks', deck),

  getDecks: () => api.get('/decks'),

  getDeck: (deckId) => api.get(`/decks/${deckId}`),

  updateDeck: (deckId, deck) => api.patch(`/decks/${deckId}`, deck),

  deleteDeck: (deckId) => api.delete(`/decks/${deckId}`),
};

export default deckApi;
