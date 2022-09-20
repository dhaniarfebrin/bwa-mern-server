const express = require('express')
const router = express.Router()

const { viewSignin, actionSignIn, actionLogOut } = require('./controller')

router.get("/", viewSignin)
router.post("/signin", actionSignIn)
router.get("/logout", actionLogOut)

module.exports = router