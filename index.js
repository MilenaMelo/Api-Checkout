// ------------------- import data --------------------------- //
const express= require("express");
const router = require("./router");

//--- require express
const app = express();

//--- require body-parser
const body_parser = require('body-parser');

// ------------------- import data --------------------------- //

app.use(body_parser.json());
app.use(express.json());
app.use(router);

// ------------------- listen port --------------------------- //

app.listen(8000);