var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/healthz', (_req, res) => {
  res.status(200).send({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

console.log('Starting in NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV != 'development') {
  app.enable('trust proxy');
}

module.exports = app;
