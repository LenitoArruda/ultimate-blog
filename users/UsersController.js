const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/ultimateblog/users", adminAuth, (req,res) => {
    
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/ultimateblog/users/new", adminAuth, (req,res) => {
    res.render("admin/users/new");
});

router.post("/ultimateblog/users/new", adminAuth, (req,res) => {
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user == undefined){ 
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt)

            User.create({
                userName: userName,
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/ultimateblog/users");
            }).catch((err) => {
                res.redirect("/admin/ultimateblog/users");
            });
        }else{
            res.redirect("/admin/ultimateblog/users/new");
        }
    })
});

router.post("/admin/ultimateblog/users/delete", adminAuth, (req, res) => {
    const id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            User.destroy({
                where: {
                    id: id
                }
            }).then(() => { 
                res.redirect("/admin/ultimateblog/users")
            });

        }else{
            res.redirect("/admin/ultimateblog/users");
        }
    }else{
        res.redirect("/admin/ultimateblog/users");
    }
});

router.get("/admin/ultimateblog/login", (req, res) => {
    res.render("admin/users/login")
});

router.post("/admin/ultimateblog/authenticate", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){
            const correct = bcrypt.compareSync(password, user.password);
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/ultimateblog/articles")
            }else{
                res.redirect("/admin/ultimateblog/login");
            }
        }else{
            res.redirect("/admin/ultimateblog/login");
        }
    })
});

router.get("/admin/ultimateblog/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/ultimateblog");
});

module.exports = router;
