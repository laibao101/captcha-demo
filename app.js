const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require('express-session');
const svgCaptcha = require('svg-captcha');

const app = express();

app.use(session({
    secret: 'laibao101',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get("/checkCode", (req, res) => {
    const { query } = req;
    const { code = "0" } = query;
    const { captcha } = req.session || {};

    if (captcha && captcha.toLocaleLowerCase() === code.toLocaleLowerCase()) {
        res.json({
            msg: "验证通过"
        });
        return;
    }

    res.json({
        msg: "验证失败"
    });
});


app.get("/genCode", (req, res) => {
    const captcha = svgCaptcha.create();

    req.session.captcha = captcha.text;
    res.type("svg");
    res.send(captcha.data);
});


app.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-access-token');
    res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(8090, () => {
    console.log(`app is listen on 8090`);
});