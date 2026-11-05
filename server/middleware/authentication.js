import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const authentication= async (req, res, next) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1];// returns secret key

        const jwtSecret = process.env.JWT_SECRET || 'greenroots_default_jwt_secret_dev_key_2026';

        if(token){
            let decodedData= jwt.verify(token, jwtSecret)
            req.userid= decodedData?.id  //id is id of logged in user
            //populate req with id for subsequent middlewares to make use
        }
        next() //calling further middlewares
    }catch(err){
        console.log(err)
    }
}

export default authentication
