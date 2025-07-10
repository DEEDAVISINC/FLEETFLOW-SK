const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>FleetFlow Test</title></head>
      <body style="background: red; color: white; padding: 50px; text-align: center; font-size: 24px;">
        <h1>FleetFlow Emergency Server</h1>
        <p>If you see this, the server is working!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p><a href="/dispatch" style="color: yellow;">Test Dispatch</a></p>
      </body>
    </html>
  `);
});

app.get('/dispatch', (req, res) => {
  res.send(`
    <html>
      <head><title>Dispatch Test</title></head>
      <body style="background: blue; color: white; padding: 50px; text-align: center; font-size: 24px;">
        <h1>Dispatch Central Test</h1>
        <p>Dispatch page is working!</p>
        <p><a href="/" style="color: yellow;">Back to Home</a></p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Emergency server running at http://localhost:${port}`);
});
