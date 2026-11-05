import { Router } from 'express'
import { login, signup, admin } from '../controllers/authentication.js'

const router = Router()

// prefix added, goes to /user/
console.log("AUTH ROUTES LOADED");
router.post('/login', login) // -> /user/login
router.post('/signup', signup) //  -> /user/signup
router.post('/admin', admin) //  -> /user/admin


export default router;