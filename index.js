const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const router = require("./api/routes");
const session = require('express-session');


const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'mycustomersunbase',
  resave: true,
  saveUninitialized: true,
}));

app.use(express.urlencoded({extended:true}));
app.use("/static",express.static(__dirname + "/static"));

app.set("view engine","ejs");
app.set("views",__dirname + "/views");

app.use(router);

app.listen(PORT, () => {
  console.log(`server is running at port number ${PORT}`);
});
