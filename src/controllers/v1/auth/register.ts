import {logger} from '@/lib/winston';
import {generateAccessToken,generateRefreshToken} from '@/lib/jwt';
import config from '@/config';

import User from '@/models/user';
import Token from '@/models/token';
import {genUsername} from '@/utils';


import type {Request,Response} from 'express';
import type {IUser} from '@/models/user';

type UserData=Pick<IUser,'email'|'password'|'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
    const {email,password,role}=req.body as UserData;

    if(role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)){
        res.status(403).json({
            code:'AuthorizationError',
            message:'You cannot register as an admin',
        });
        logger.warn(
            `User with email ${email} tried to register as an admin but is not whitelist`
        );
        return;
    };
    
    try {
        const username=genUsername();

        const newUser=await User.create({
            username,
            email,
            password,
            role
        });

        const accessToken=generateAccessToken(newUser._id);
        const refreshToken=generateRefreshToken(newUser._id);

        await Token.create({token:refreshToken,userId:newUser._id});
        logger.info('Refresh Token Created for user',{
            userId:newUser._id,
            token:refreshToken
        });


        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:config.NODE_ENV==='production',  
            sameSite:'strict',
        })

        res.status(201).json({
            user:{
                username:newUser.username,
                email:newUser.email,
                role:newUser.role
            },
            accessToken,
        });

        logger.info('User Registered Succesfully',{
            username:newUser.username,
            email:newUser.email,
            role:newUser.role
        });
        
    } catch (err) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err,
      });
      logger.error('Error during user registration', err);
    }
  };

export default register;
