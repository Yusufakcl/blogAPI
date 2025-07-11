import {logger} from '@/lib/winston';

import type {Request,Response} from 'express';

import User from '@/models/user';

const deleteCurrentUser = async (req:Request,res:Response):Promise<void> => {
    const userId=req.userId;
    try{
        await User.deleteOne({_id:userId});
        logger.info('User account deleted successfully',userId);
        res.status(204);
    }catch(err){
        res.status(500).json({
            code:"ServerError",
            message:"Internal server error",
            error:err
        });   
        logger.error('Error while deleting current user account',err);
    }
};

export default deleteCurrentUser;