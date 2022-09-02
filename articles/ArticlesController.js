const express = require("express");
const router = express.Router();
const Catedory = require("../categories/Category");


router.get("/ultimateblog/articles", (req, res) => {
    res.send("Articles route.")
});

router.get("/admin/ultimateblog/articles/new", (req, res) => {
    Catedory.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories})
    })
    
});

module.exports = router;