const path = require('path');
const express = require('express');
const args = require('minimist')(process.argv.slice(2));

const app = express();

const outputPath = path.resolve(__dirname, '../build');
app.use('/', express.static(outputPath));
app.get('*', (_, res) => res.sendFile(path.resolve(outputPath, 'index.html')));

const port = args.port || args.p || process.env.PORT || 3000;
const host = args.host || args.h || process.env.HOST || null; // null is to let http.Server use its default IPv6/4 host
const prettyHost = host || 'localhost';

app.listen(port, host, () => {
  console.log(`Server started on ${prettyHost}:${port}! ✔`);
});
