// tempat routing
// export ke app.js

var express = require("express");
var router = express.Router();

// import controller
const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete } = require("./controller") 

const {isLoginAdmin} = require('../middleware/auth')

router.use(isLoginAdmin)
// page route
router.get("/", index)
router.get("/create", viewCreate)
router.get("/edit/:id", viewEdit)

// handle action route
router.post("/create", actionCreate) // create
router.put("/edit/:id", actionEdit) // update
router.delete("/delete/:id", actionDelete) // delete

module.exports = router;
