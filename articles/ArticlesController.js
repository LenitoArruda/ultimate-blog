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


router.get("/admin/ultimateblog/articles/edit/:id", (req, res) => {
    const id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article !=undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article})
            });
            
        }else{
            req.redirect("/admin/ultimateblog/articles");
        }
    }).catch(err => {
        req.redirect("/admin/ultimateblog/articles");
    });

    
});

router.post("/admin/ultimateblog/articles/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.update({title: title, body: body, categoryId: category, slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/ultimateblog/articles")
    }).catch(err => {
        res.redirect("/admin/ultimateblog/articles")
    })

});

router.get("/ultimateblog/articles/page/:num", (req, res) => {
    const page = req.params.num;
    const offset = 0;
    if(isNaN(page) || page == 1){
        offset = 0
    }

    Article.findAndCountAll({
        limit: 4,
        offset: 2
    }).then(articles => {
    res.json(articles);
    })
})

module.exports = router;