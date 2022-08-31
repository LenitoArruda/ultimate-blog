const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/ultimateblog/categories/new", (req, res) => {
    res.render("admin/categories/new")
});

router.post("/ultimateblog/categories/save", (req, res) => {
    const title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() =>{
            res.redirect("/ultimateblog/categories");
        })
    }else{
        res.redirect("/admin/ultimateblog/categories/new")
    }

});

router.get("/ultimateblog/categories", (req, res) =>{
    
    Category.findAll().then(categories => {

        res.render("admin/categories/index", {categories: categories});
    });
    
});

router.post("/admin/ultimateblog/categories/delete", (req, res) => {
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => { 
                res.redirect("/ultimateblog/categories")
            });

        }else{
            res.redirect("/ultimateblog/categories");
        }
    }else{
        res.redirect("/ultimateblog/categories");
    }
});

module.exports = router;