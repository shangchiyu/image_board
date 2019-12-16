const spicedPg = require("spiced-pg");

const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/wintergreen-imageboard`;
const db = spicedPg(dbUrl);

exports.getImages = function getImages() {
    let q = "SELECT * FROM images"; // or return db.query("SELECT * FROM images")
    return db.query(q);
};

exports.insertImages = function insertImages(
    url,
    username,
    title,
    description
) {
    return db.query(
        "INSERT INTO images ( url, username, title, description)VALUES($1, $2, $3, $4)RETURNING*",
        [url, username, title, description]
    );
};

exports.popImages = function popImages(id) {
    let q = "SELECT * FROM images WHERE id = $1";
    let param2 = [id];
    return db.query(q, param2);
};
