import db from "../db/db.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"



const register = (req, res) => {
// check user if exist
    //create a new user
    // hash the password
    const { username, email, password, name } = req.body

    db.query("SELECT * FROM users WHERE username = ? OR email = ? ", [username , email], (err, data) => {
        if (err) return res.status(500).json(err) 
        // @ts-ignore
        if (data.length) return res.status(409).json("User already exists !")
        //create a new user 
        // method of hash password : incrypt password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        db.query("insert into users(username, email, password, name) values(?, ?, ?, ?)", [username, email, hashedPassword, name], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created");
            // id : is user
            //const token = jwt.sign({ id: data[0].id }, "secretkey");
        })
    
    })


}


const login = (req, res) => {
    const { email, password } = req.body

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, data) => {
        if (err) return res.status(500).json(err);
        // @ts-ignore
        if (data.length === 0) return res.status(404).json("User not found");
        const verifyPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!verifyPassword) return res.status(400).json("Wrong password or email");
        // creer token , sign = user infos
        const token = jwt.sign({ id: data[0].id }, "secretkey");

        const { password, ...others } = data[0];

        res.cookie("accessToken", token, { //ici infos cookie
            httpOnly: true,
        }).status(200).json(others); // ici others = user informations
    })


}
const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite:"none"
    }).status(200).json("User has been logged out")
}



export { register, login, logout}