const express = require('express')
const router = express.Router()

// tambahan karena ada upload file
const multer = require('multer')
const os = require('os')

const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete, actionStatus } = require('./controller')

const {isLoginAdmin} = require('../middleware/auth')

router.use(isLoginAdmin)
// router pages
router.get('/', index)
router.get('/create', viewCreate)
router.get('/edit/:id', viewEdit)

// action route
router.post('/create', multer({ dest: os.tmpdir() }).single('thumbnail'), actionCreate)
router.put('/edit/:id', multer({ dest: os.tmpdir() }).single('thumbnail'), actionEdit)
router.delete('/delete/:id', actionDelete)
router.put('/edit_status/:id', actionStatus)

module.exports = router