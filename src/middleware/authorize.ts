import logger from "winston";

import User from "@/models/user";

import type { Request, Response, NextFunction } from "express";

export type Authrole='admin' | 'user'

const authorize = (roles:Authrole[]) => {
    return async (req:Request,res:Response,next:NextFunction)=>{
        const userId = req.userId;
        try{
            const user=await User.findById(userId).select('role').exec();
            
            if(!user){
                res.status(404).json({
                    code:"NotFound",
                    message:"User not found",
                });
                return;
            };
            if(!roles.includes(user.role)){
                res.status(403).json({
                    code:"AuthorizationError",
                    message:"Access denied,insufficient permissions",
                });
                return
            }
            return next();
        }catch(err){
            res.status(500).json({
                code:"ServerError",
                message:"Internal server error",
                error:err,
            });
            logger.error(`Error while authorizing user: ${err}`);
        }
    };
};

export default authorize;