const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");


router.get("/admin/ultimateblog/users", (req,res) => {
    res.send("Listagem de usuários");
});

router.get("/admin/ultimateblog/users/create", (req,res) => {
    res.render("admin/users/create");
});

router.post("/ultimateblog/users/create", (req,res) => {
    const email = req.body.email;
    const userName = req.body.userName;
    const password = req.body.password;

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
});


User.sync({force: false});


module.exports = router;
