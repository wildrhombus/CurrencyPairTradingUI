const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      request = require('request');
const app = express();
const routes = express.Router();

// Configure port
const port = process.env.PORT || 3001;

// Configure general url for bitfinex
const bitfinexUrl = 'https://api.bitfinex.com/v1';

// Setup app server and routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

// Route to get the bitfinex ticker information.
routes.get('/ticker', function(req, res, next) {
  request.get(bitfinexUrl + '/pubticker/btcusd').pipe(res);
});

// Listen for requests
app.listen(port, function() {
    console.log('Server listening on port ' + port)
});