const http = require('http');
const url = 'http://localhost:5000/api/pavilion/bookings?pavilionId=11111111-1111-1111-1111-111111111111';
http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', (err) => console.error('ERR', err));
