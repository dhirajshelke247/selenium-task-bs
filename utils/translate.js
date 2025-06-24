import axios from 'axios';

export async function translateText(text, to = 'en') {
  const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text';
  const headers = {
    'content-type': 'application/json',
    'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
    'x-rapidapi-key': process.env.RAPIDAPI_KEY
  };
  const data = { from: 'auto', to, text };
  try {
    const response = await axios.post(url, data, { headers });
    return response.data.trans || text;
  } catch (err) {
    console.error('Translation error:', err.message);
    return text;
  }
}