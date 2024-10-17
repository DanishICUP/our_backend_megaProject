import { Router } from 'express';
import { registeruser,LoginUser,LogOutUser,RefreashTokenAccess } from '../controllers/user.controller.js';
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

//secure routes
router.route('/logout').post(verifyJWT, LogOutUser)
router.route('/refresh-token').post(RefreashTokenAccess)

export default router;