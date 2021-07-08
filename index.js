// ------------------- import data --------------------------- //
const express= require("express");
const router = require("./router");

//--- require express
const server = express();

//--- require body-parser
const body_parser = require('body-parser');

// ------------------- import data --------------------------- //

server.use(body_parser.json());
server.use(express.json());
server.use(router);

// ------------------- listen port --------------------------- //

server.listen(8000);