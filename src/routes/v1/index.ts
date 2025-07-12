import { time } from "console";
import { Router } from "express";
import { version } from "os";
const router = Router();

import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';
import blogRoutes from '@/routes/v1/blog';

router.get('/',(req,res)=>{
    res.status(200).json({
        message:'API is live',
        status:"ok",
        version:'1.0.0',
        docs:"blabla.com",
        time: new Date().toISOString(),
    });
            
});

router.use('/auth',authRoutes);
router.use('/users',userRoutes);
router.use('/blogs',blogRoutes);

export default router;