const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/ultimateblog/articles", adminAuth, (req, res) => {
    
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
    
    
});

router.get("/admin/ultimateblog/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories})
    })
    
});

router.post("/admin/ultimateblog/articles/save", adminAuth, (req, res) => {
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

router.post("/admin/ultimateblog/articles/delete", adminAuth, (req, res) => {

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


router.get("/admin/ultimateblog/articles/edit/:id", adminAuth, (req, res) => {
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

router.post("/admin/ultimateblog/articles/update", adminAuth, (req, res) => {
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
    let offset = 0;
    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page)-1) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        let next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        });
    });
})

//router.get();

module.exports = router;