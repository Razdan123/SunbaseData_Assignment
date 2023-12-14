const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.send("This is from Accounts home");
});

// Handle POST request for login
router.post("/login", async (req, res) => {
  try {
    const { loginid, password } = req.body;

    const apiResponse = await axios.post(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp",
      {
        login_id: loginid,
        password: password,
      }
    );

    res.json(apiResponse.data);
  } catch (error) {
    // Log the detailed response from the external API
    console.error("Error during login:", error.response.data);
    console.error("Status Code:", error.response.status);
    // Send an error response back to the client
    res
      .status(error.response.status || 500)
      .json({ error: "Internal Server Error" });
  }
});

router.post("/create-customer", async (req, res) => {
  try {
    // Retrieve the access token from the user's session or request headers
    // Note: This is a simplified example; you may want to use a proper authentication mechanism.
    const accessToken = req.headers.authorization || req.session.accessToken;

    const { first_name, last_name, street, address, city, state, email, phone } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({ error: "First Name or Last Name is missing" });
    }

    // Make a POST request to create a new customer
    const apiResponse = await axios.post(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp",
      {
        cmd: "create",
        first_name: first_name,
        last_name: last_name,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Check the response status and send the appropriate status to the client
    if (apiResponse.status === 201) {
      res.status(201).json({ message: "Successfully Created" });
    } else {
      res.status(apiResponse.status).json({ error: "Failed to create customer" });
    }
  } catch (error) {
    // Log the detailed response from the external API
    console.error("Error creating customer:", error.response.data);
    console.error("Status Code:", error.response.status);

    // Send an error response back to the client
    res
      .status(error.response.status || 500)
      .json({ error: "Internal Server Error" });
  }
});

module.exports = router;

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/board", (req, res) => {
  res.render("board");
});

// router.post("/signup", async (req, res) => {
//   const { name, email, username, password, confirmpassword } = req.body;

//   if (!name || !email || !username || !password || !confirmpassword) {
//     res.render("signup", {
//       csrfToken: req.csrfToken(),
//       err: "All fields required!",
//     });
//   } else if (password != confirmpassword) {
//     res.render("signup", {
//       csrfToken: req.csrfToken(),
//       err: "Passwords are not matching!",
//     });
//   } else {
//     var userData = await users.findOne({
//       $or: [{ email: email }, { username: username }],
//     });

// if(userData){
//     res.render("signup", {
//         csrfToken: req.csrfToken(),
//         err: "User Exists! Try again",
//       });
// }else{
// var salt = await bcrypt.genSalt(12);
// var hash = await bcrypt.hash(password, salt);

// await users({
//     name:name,
//     email:email,
//     username:username,
//     password:hash,
// }).save();

// res.redirect("/login");

// }

//   }
// });

// router.post('/login',(req,res,next)=>{
//   passport.authenticate('local',{
//     failureRedirect : '/login',
//     successRedirect : '/board',
//     failureFlash : true,
//   })(req,res,next);
// });

// router.get('/logout',(req,res)=>{
//   req.logOut();
//   req.session.destroy((err)=>{
// res.redirect('/');
//   })
// })
// //board routes
// router.use('/board',require("./idearoutes"));

module.exports = router;
