const http = require('http');

// Define the port number
const port = 3000;

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running on port ' + port);
});

// Start the server
server.listen(port, () => {
  console.log('Server is running on port ' + port);
});