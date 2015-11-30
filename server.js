var fs = require('fs');
var morgan = require('morgan'); // Charge le middleware de logging
var express = require('express');
var app = express();

app
.use(morgan('combined')) 
.use(express.static('src/'));

app.listen(1848);

