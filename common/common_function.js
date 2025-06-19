import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const jwtVerfication = function (req, res, next){
    if(process.env.EXCEPTIONAL_URL.includes(req.path)){
        next()
    }
    else{
        jwt.verify(req.headers.authorization, process.env.AUTH_KEY,(err,result)=>{
            if(err){
                return res.status(401).send({
                    message : "Provide authorization token"
                })
            }
            else{
                req.authBody = result;
                next()
            }
        })
    }
}

export default jwtVerfication