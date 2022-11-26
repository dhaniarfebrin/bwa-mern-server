const express = require("express");
const router = express.Router();

const { landingPage, detailPage, category, checkout, historyTransaction } = require("./controller");
const { isLoginPlayer } = require('../middleware/auth') // middleware buat validasi login user

// ruters of pages
router.get('/landingpage', landingPage)
router.get('/category', category)
router.get('/:id/detail', detailPage)
router.post('/checkout', isLoginPlayer, checkout)

//history transaction
router.get('/history', isLoginPlayer, historyTransaction) // all transaction

module.exports = router