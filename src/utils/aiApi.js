import api from './api';

export const aiApi = {
  generateStoryline: (prompt, slideCount) => api.post('/ai/storyline', { prompt, slideCount }),
};

export default aiApi;
