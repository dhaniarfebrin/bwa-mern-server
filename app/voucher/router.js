const express = require('express')
const router = express.Router()

// tambahan karena ada upload image
const multer = require('multer')
const os = require('os')

const { index, viewCreate, actionCreate, viewEdit } = require('./controller')

// router pages
router.get('/', index)
router.get('/create', viewCreate)
router.get('/edit/:id', viewEdit)

// action route
router.post('/create', multer({ dest: os.tmpdir() }).single('thumbnail'), actionCreate)

module.exports = router