const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const router = require("./api/routes");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require('cors');


const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// app.use(session({
//   key: 'user_sid',
//   secret: 'mycustomersunbase',
//   resave: false,
//   saveUninitialized: true,
//   cookie:{
//     expires: 600000
//   }
// }));

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true } // set to true in production if using HTTPS
}));

app.use(express.urlencoded({extended:true}));
app.use("/static",express.static(__dirname + "/static"));

app.set("view engine","ejs");
app.set("views",__dirname + "/views");

app.use(router);

app.listen(PORT, () => {
  console.log(`server is running at port number ${PORT}`);
});
