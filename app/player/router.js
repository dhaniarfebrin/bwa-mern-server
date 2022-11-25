const express = require("express");
const router = express.Router();

const { landingPage, detailPage, category, checkout } = require("./controller");
const { isLoginPlayer } = require('../middleware/auth')

// ruters of pages
router.get('/landingpage', landingPage)
router.get('/category', category)
router.get('/:id/detail', detailPage)
router.post('/checkout', isLoginPlayer, checkout)

module.exports = router