const express = require("express");
const router = express.Router();

const { landingPage, detailPage, category, checkout, historyTransaction, historyTransactionDetail, dashboard, profile } = require("./controller");
const { isLoginPlayer } = require('../middleware/auth') // middleware buat validasi login user

// ruters of pages
router.get('/landingpage', landingPage)
router.get('/dashboard', isLoginPlayer, dashboard)
router.get('/profile', isLoginPlayer, profile)
router.get('/category', category)
router.get('/:id/detail', detailPage)
router.post('/checkout', isLoginPlayer, checkout)

//history transaction
router.get('/history', isLoginPlayer, historyTransaction)
router.get('/history/:id/detail', isLoginPlayer, historyTransactionDetail)

module.exports = router