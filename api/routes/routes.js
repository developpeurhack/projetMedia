import { Router } from "express"
import {getAll, getOne, createOne, updateOne, deleteOne } from '../controllers/controller.js'
import getUser from "../controllers/user.js";
import { login, register, logout } from "../controllers/auth.js";
import { getPosts , addPost} from "../controllers/post.js"
const router = Router()

router.get('/getAll', getAll)
router.get('getOne/:id', getOne)
router.post('createOne', createOne)
router.put('updateOne/:id', updateOne)
router.delete('deleteOne/:id', deleteOne)



// user 
router.get('/find/:userId', getUser)


// posts
router.get('/', getPosts)
router.post('/auth/posts', addPost)


// auth
router.post('/register', register)
router.post('/login', login)
router.post('/logout',logout)

export default router