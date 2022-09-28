const express = require("express");
const router = express.Router();

const { landingPage } = require("./controller");

// ruters of pages
router.get('/landingpage', landingPage)

module.exports = router