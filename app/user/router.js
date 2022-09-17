const express = require('express')
const router = express.Router()

const { viewSignin, actionSignIn } = require('./controller')

router.get("/", viewSignin)
router.post("/signin", actionSignIn)

module.exports = router