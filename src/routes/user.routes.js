import { Router } from 'express';
import { registeruser } from '../controllers/user.controller.js';
import {upload} from '../middleware/multer.middleware.js'

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

export default router;