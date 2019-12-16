//this is our server
const express = require("express");
const app = express();

const s3 = require("./s3");
const s3Url = require("./config");
const db = require("./db");

app.use(express.static("./public"));

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

const bodypaser = require("body-parser");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/upload");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("req.file ", req.file);
    // console.log("req.body ", req.body);

    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        var url = s3Url.s3Url + req.file.filename;
        db.insertImages(
            url,
            req.body.username,
            req.body.title,
            req.body.description
        ).then(data => {
            console.log("data!", data.rows);
            res.json(data.rows);
            // INSERT -- title, description, username, s3Url + filename
        });
    } else {
        res.json({
            success: false
        });
    }
});
app.get("/images", (req, res) => {
    console.log("GET/images");
    db.getImages()
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => console.log("error", err));
});

app.get("/images/:id", (req, res) => {
    console.log("GET/images:id");
    db.popImages(req.params.id)
        .then(data => {
            res.json(data.rows);
        })
        .catch(err => {
            console.log("error", err);
        });
});

// let cities = [
//     {
//         name: "Berlin",
//         country: "DE"
//     },
//     {
//         name: "NYC",
//         country: "USA"
//     }
// ];
// app.get("/get-cities", (req, res) => {
//     console.log("get");
//     res.json(cities); // res.json is good for sending data from back ->front
// });

app.listen(8081, () => console.log("listening!"));
