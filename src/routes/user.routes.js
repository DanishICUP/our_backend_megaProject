import { Router } from 'express';
import { registeruser,LoginUser,LogOutUser } from '../controllers/user.controller.js';
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT} from '../middleware/auth.middleware.js'
const router = Router();

router.route('/register').post( 
    upload.fields([
        {
            name:'avatar',
            maxCount: 1
        },
        {
            name:'coverImage',
            maxCount: 1
        }
        
        
    ]),   
    registeruser
)
router.route('/login').post(LoginUser)
router.route('/logout').post(verifyJWT, LogOutUser)

export default router;