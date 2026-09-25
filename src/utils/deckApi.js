import api from './api';

export const deckApi = {
  createDeck: (deck) => api.post('/decks', deck),

  getDecks: () => api.get('/decks'),

  getDeck: (deckId) => api.get(`/decks/${deckId}`),

  updateDeck: (deckId, deck) => api.patch(`/decks/${deckId}`, deck),

  deleteDeck: (deckId) => api.delete(`/decks/${deckId}`),
};

export default deckApi;
