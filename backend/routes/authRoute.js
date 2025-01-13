const express = require("express");
const router = express.Router(); 
const {login, signup} = require("../controllers/authController");

// User signup
router.post("/signup", signup);

// User login
router.post('/login', login);

module.exports = router; // Ensure this is the correct export.
