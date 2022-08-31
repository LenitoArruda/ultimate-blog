const express = require("express");
const router = express.Router();


router.get("/ultimateblog/articles", (req, res) => {
    res.send("Articles route.")
});
router.get("/admin/ultimateblog/articles/new", (req, res) => {
    res.send("Create new articles.")
});

module.exports = router;