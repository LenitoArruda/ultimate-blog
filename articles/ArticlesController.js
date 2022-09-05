const express = require("express");
const router = express.Router();
const Catedory = require("../categories/Category");
const Article = require("../articles/Article");
const slugify = require("slugify");


router.get("/admin/ultimateblog/articles", (req, res) => {
    res.render("admin/articles/index")
});

router.get("/admin/ultimateblog/articles/new", (req, res) => {
    Catedory.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories})
    })
    
});

router.post("/admin/ultimateblog/articles/save", (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;
    
    Article.create({
        title: title,
        body: body,
        slug: slugify(title),
        categoryId: category
    }).then(() => {
        res.redirect("/admin/ultimateblog/articles");
    })
})


module.exports = router;