const express = require('express')
const router = express.Router()

// tambahan karena ada upload image
const multer = require('multer')
const os = require('os')

const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete } = require('./controller')

// router pages
router.get('/', index)
router.get('/create', viewCreate)
router.get('/edit/:id', viewEdit)

// action route
router.post('/create', multer({ dest: os.tmpdir() }).single('thumbnail'), actionCreate)
router.put('/edit/:id', multer({ dest: os.tmpdir() }).single('thumbnail'), actionEdit)
router.delete('/delete/:id', actionDelete)

module.exports = router