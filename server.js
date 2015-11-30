var fs = require('fs');
var morgan = require('morgan'); // Charge le middleware de logging
var express = require('express');
var app = express();

app
.use(morgan('combined')) 
.use(express.static(folder));

app.listen(1848);

