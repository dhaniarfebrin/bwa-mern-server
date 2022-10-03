const express = require("express");
const router = express.Router();

const { landingPage, detailPage, category } = require("./controller");

// ruters of pages
router.get('/landingpage', landingPage)
router.get('/category', category)
router.get('/:id/detail', detailPage)

module.exports = router