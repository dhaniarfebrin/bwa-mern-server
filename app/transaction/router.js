const express = require("express");
const router = express.Router();

const { index } = require("./controller");

const {isLoginAdmin} = require('../middleware/auth')

router.use(isLoginAdmin)
// ruters of pages
router.get('/', index)

module.exports = router