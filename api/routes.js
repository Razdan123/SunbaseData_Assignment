const express = require("express");
const router = express.Router();
const axios = require("axios");
const session = require("express-session");

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
      },
      {
        timeout: 10000,
      }
    );

    const accessToken = apiResponse.data.access_token;

    console.log("Retrieved Access Token:", accessToken);

    req.session.accessToken = accessToken;

    const customerListResponse = await axios.get(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const customerList = customerListResponse.data;

    console.log("Customer List:", customerList);

    res.render("board", { data: customerList });
  } catch (error) {
    console.error("Error during login:", error.message);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/create-customer", async (req, res) => {
  try {
    console.log(req.session); 
    const accessToken = req.session.accessToken;
    console.log(accessToken);

    const {
      first_name,
      last_name,
      street,
      address,
      city,
      state,
      email,
      phone,
    } = req.body;

    if (!first_name || !last_name) {
      return res
        .status(400)
        .json({ error: "First Name or Last Name is missing" });
    }

    // Make a POST request to create a new customer
    const apiResponse = await axios.post(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create",
      {
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

    if (apiResponse.status === 201) {
      res.status(201).json({ message: "Successfully Created" });
    } else {
      res
        .status(apiResponse.status)
        .json({ error: "Failed to create customer" });
    }
  } catch (error) {
    console.error("Error creating customer:", error.response.data);
    console.error("Status Code:", error.response.status);

    res
      .status(error.response.status || 500)
      .json({ error: "Internal Server Error" });
  }
});

// Delete a customer
router.post("/delete-customer", async (req, res) => {
  try {
    const accessToken = req.headers.authorization || req.session.accessToken;

    const { cmd, uuid } = req.body;

    if (!cmd || cmd !== "delete" || !uuid) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const apiResponse = await axios.post(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp",
      {
        cmd: "delete",
        uuid: uuid,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (apiResponse.status === 200) {
      res.status(200).json({ message: "Successfully deleted" });
    } else if (apiResponse.status === 400) {
      res.status(400).json({ error: "UUID not found" });
    } else {
      res.status(500).json({ error: "Error Not deleted" });
    }
  } catch (error) {
    console.error("Error deleting customer:", error.response.data);
    console.error("Status Code:", error.response.status);

    res
      .status(error.response.status || 500)
      .json({ error: "Internal Server Error" });
  }
});

// Update a customer
router.post("/update-customer", async (req, res) => {
  try {
    const accessToken = req.headers.authorization || req.session.accessToken;

    const { cmd, uuid, ...customerData } = req.body;

    if (
      !cmd ||
      cmd !== "update" ||
      !uuid ||
      Object.keys(customerData).length === 0
    ) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    const apiResponse = await axios.post(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp",
      {
        cmd: "update",
        uuid: uuid,
        ...customerData,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (apiResponse.status === 200) {
      res.status(200).json({ message: "Successfully updated" });
    } else if (apiResponse.status === 400) {
      res.status(400).json({ error: "UUID not found" });
    } else {
      res.status(500).json({ error: "Error updating customer" });
    }
  } catch (error) {
    console.error("Error updating customer:", error.response.data);
    console.error("Status Code:", error.response.status);

    res
      .status(error.response.status || 500)
      .json({ error: "Internal Server Error" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/board", (req, res) => {
  res.render("board");
});

module.exports = router;
