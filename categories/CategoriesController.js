const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/ultimateblog/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new")
});

router.post("/admin/ultimateblog/categories/save", adminAuth, (req, res) => {
    const title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() =>{
            res.redirect("/admin/ultimateblog/categories");
        })
    }else{
        res.redirect("/admin/ultimateblog/categories/new")
    }

});

router.get("/admin/ultimateblog/categories", adminAuth, (req, res) =>{
    
    Category.findAll().then(categories => {

        res.render("admin/categories/index", {categories: categories});
    });
    
});

router.post("/admin/ultimateblog/categories/delete", adminAuth, (req, res) => {
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => { 
                res.redirect("/admin/ultimateblog/categories")
            });

        }else{
            res.redirect("/admin/ultimateblog/categories");
        }
    }else{
        res.redirect("/admin/ultimateblog/categories");
    }
});

router.get("/admin/ultimateblog/categories/edit/:id", adminAuth, (req, res) => {
    const id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/ultimateblog/categories");
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){
            
            res.render("admin/categories/edit", {category: category});

        }else{
            res.redirect("/admin/ultimateblog/categories");
        }
    }).catch(error => {
        res.redirect("/admin/ultimateblog/categories");
    })

});

router.post("/admin/ultimateblog/categories/edit", adminAuth, (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id            
        }
    }).then(() => {
        res.redirect("/admin/ultimateblog/categories");
    })
});

module.exports = router;