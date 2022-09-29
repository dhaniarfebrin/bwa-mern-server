const express = require("express");
const router = express.Router();

// tambahan karena ada upload image
const multer = require('multer')
const os = require('os')

const { signUp } = require("./controller");

// ruters of pages
router.post('/signup', multer({ dest: os.tmpdir() }).single('avatar'), signUp)

module.exports = router