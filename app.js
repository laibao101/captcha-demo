const express = require("express");
const path = require("path");
const fs = require("fs");
const captchapng = require('captchapng');
const jwt = require("jsonwebtoken");

const app = express();
const privateKey = "laobao101";

app.use(express.static(__dirname + "/public"));
app.get("/checkCode", (req, res) => {
    const { query } = req;
    const { token, code } = query;

    try {
        const decoded = jwt.verify(token, privateKey);

        if (decoded && decoded.iss === code) {
            res.json({
                code: 0,
                msg: "验证通过"
            });
        }
        res.json({
            code: 0,
            msg: "验证失败"
        });
    } catch (err) {
        res.json({
            code: 1,
            msg: err.message
        });
    }
});

app.get("/genCode", (req, res) => {
    const code = (Math.random() * 1000000).toString().substr(0, 4);
    const token = jwt.sign({ iss: code, }, privateKey);
    const captcha = new captchapng(80, 30, code);
    captcha.color(0, 0, 0, 0);
    captcha.color(80, 80, 80, 255);
    const img = captcha.getBase64();
    const imgbase64 = Buffer.from(img, 'base64');
    fs.writeFileSync(path.resolve(__dirname, "public/captcha.png"), imgbase64);

    res.json({
        code: 0,
        token,
        imgUrl: '/captcha.png'
    });
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