import db from "../db/db.js"
import jwt from "jsonwebtoken";
import moment from "moment"

// recuperer les postes
const getPosts = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    // dans le token les infos de user 
    if (!token) return res.status(401).json("Not logged in !");
    // data[0].id = userInfo
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");
        //console.log(userId)

        const q = userId !== "undefined"
            ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
            : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
        ORDER BY p.createdAt DESC`;

        const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data)
        });
    });
};


// creation d'1 poste
const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in !");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json({ msg: "Token is not valid " });

        const values = [req.body.desc, req.body.img, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id]
        db.query("INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`)VALUES(?)", [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created with success")
        })
    })





}

export { getPosts , addPost}
