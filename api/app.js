import express from "express"
const app = express()
import routes from './routes/routes.js'
//import db from './db/db.js';
import bodyParser from "body-parser"
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
const port = process.env.port 


// middleware parse
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
}
));

app.use(cookieParser())




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../frontend/public/upload");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    
    }
});
const upload = multer({ storage:storage })
app.post("/upload", upload.single("file"), (req, res) => {
    const file = req.file
    res.status(200).json(file.filename)
})
// midlleware des routes
app.use(routes);


app.listen(port, () => {
    console.log(`your listening on ${port}`);
});
