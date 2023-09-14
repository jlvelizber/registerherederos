import {Response, Request, NextFunction  } from 'express';
const jwt = require('jsonwebtoken');


export const validarJWT = (req:  Request, res : Response, next: NextFunction) => {

    const token = req.header('x-token');
    if(!token)
    {
        return  res.status(401).send({
            ok: false,
            msg: 'invalid token'
        })
    }
    
    
    // validate the token
    try {
        
        const key = process.env.SECRET_JWT_KEY;
        
        const {uid, name} = jwt.verify(token, key )
        
        req.body.uid = uid;
        req.body.name = name;
        
    } catch (error) {
        return  res.status(401).send({
            ok: false,
            msg: 'invalid token'
        })
    }


    next();
}

