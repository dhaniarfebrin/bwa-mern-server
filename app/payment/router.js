const express = require("express");
const router = express.Router();

const { index, viewCreate, actionCreate } = require("./controller");

// ruters of pages
router.get('/', index)
router.get('/create', viewCreate)
// router.get('/edit/:id', viewEdit)

// action
router.post('/create', actionCreate)
// router.put('/edit/:id', actionEdit)
// router.delete('/delete/:id', actionDelete)

module.exports = router