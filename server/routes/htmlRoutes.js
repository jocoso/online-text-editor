const path = require('path');

module.exports = (app) =>
  // Homepage
  app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
  );
