import { Router } from "express";
import  register  from "@/controllers/v1/auth/register";
import {body} from 'express-validator';
import validationError from "@/middleware/validationError";
import user from "@/models/user";

const router=Router();

router.post('/register',
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({max:50})
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async(value)=>{
        const userExists=await user.exists({email:value});
        if(userExists){
            throw new Error('User Email or password is invalid');
        };
    }),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min:8})
    .withMessage('Password must be at least 8 characters long'),
    body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin','user'])
    .withMessage('Role must be either admin or user'),
    validationError,
    register,
);

export default router;

