const express = require("express");
const router = express.Router();
const { searchUser } = require("../controller/controllers");

router.post("/search", searchUser);

module.exports = router;