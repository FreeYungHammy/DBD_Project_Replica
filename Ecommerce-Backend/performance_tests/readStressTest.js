const axios = require('axios');
const http  = require('http');
axios.defaults.httpAgent = new http.Agent({ maxSockets: Infinity });

const API_URL = 'http://localhost:5000/api/orders/all';

async function getOrders(i) {
  try {
    const res = await axios.get(API_URL);
    console.log(`#${i} → ${res.status}`);
  } catch (err) {
    // Log both HTTP status and any network error code/message
    console.error(
      `#${i} FAILED`,
      err.response
        ? `HTTP ${err.response.status}`
        : err.code || err.message
    );
  }
}

(async () => {
  console.time('duration');
  await Promise.all(Array.from({ length: 1000 }, (_, i) => getOrders(i+1)));
  console.timeEnd('duration');
})();
