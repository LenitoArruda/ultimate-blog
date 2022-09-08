const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const slugify = require("slugify");


router.get("/admin/ultimateblog/articles", (req, res) => {
    
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
    
    
});

router.get("/admin/ultimateblog/articles/new", (req, res) => {
    Category.findAll().then(categories => {
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
});

router.post("/admin/ultimateblog/articles/delete", (req, res) => {

    const id = req.body.id;
    if( id != undefined ){
        if (!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => { 
                res.redirect("/admin/ultimateblog/articles")
            });

        }else{
            res.redirect("/admin/ultimateblog/articles");
        }
    }else{
        res.redirect("/admin/ultimateblog/articles");
    }

});

router.get("/admin/ultimateblog/articles/:id", (req, res) => {
    const id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/ultimateblog/articles");
    }

    Category.findByPk(id).then(article => {
        if(article != undefined){
            
            res.render("admin/categories/edit", {article: article});

        }else{
            res.redirect("/admin/ultimateblog/articles");
        }
    }).catch(error => {
        res.redirect("/admin/ultimateblog/articles");
    })

});

router.post("/admin/ultimateblog/articles/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const categoryId = req.body.categoryId;

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id            
        }
    }).then(() => {
        res.redirect("/admin/ultimateblog/articles");
    })
});



module.exports = router;