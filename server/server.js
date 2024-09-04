const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000; // localhost:3000

app.use(express.static('../client/dist')); // public folder
app.use(express.urlencoded({ extended: true })); // parses incoming requests for POST and PUT calls
app.use(express.json()); // Parses requests

require('./routes/htmlRoutes')(app);

app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
