const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//View engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
    secret: "sAsfd@FFWedcdfFDWEF",
    cookie: {
        maxAge: 18000000 // 5 Hours (1000 = 1 sec)
    }
}))

//Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection.authenticate()
    .then(() => {
        console.log("Successful connection!")
    }).catch((error) => {
        console.log(error);
    });


app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


//Routes
app.get("/ultimateblog",(req, res) => {
    Article.findAll({
        limit: 4,
        order: [
            ['id', 'DESC']   
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
        
    })

    
});


app.get("/ultimateblog/:slug",(req, res) => {
   const slug = req.params.slug;
   Article.findOne({
        where:{
            slug: slug
        }
   }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/ultimateblog");
        }
   }).catch(err => {
        console.log(err);
        res.redirect("/ultimateblog");
   })
});

app.get("/ultimateblog/category/:slug",(req, res) => {
    const slug = req.params.slug;
    Category.findOne({
        where: {
            slug:slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            });
        }else{
            res.redirect("/ultimateblog");
        }
    }).catch(err => {
        res.redirect("/ultimateblog");
    });
    
})


app.listen(8080, () => {
    console.log("Server running!")
});