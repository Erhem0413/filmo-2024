const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3/';
const key = process.env.TMDB_KEY || '254242f559f8eb777874db6454636069';

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params);

  return `${baseUrl}${endpoint}?api_key=${key}&${qs}`;
};

// console.log(`${baseUrl}?api_key=${key}`);

export default { getUrl };