// tempat routing

var express = require("express");
var router = express.Router();

// import controller
const {index} = require("./controller") 

/* GET home page. */
router.get("/", index)

module.exports = router;
