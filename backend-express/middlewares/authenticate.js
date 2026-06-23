import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export default function authentication(req, res, next) {
        const header = req.headers["authorization"];
        // console.log(header);

        if(header == null) {
            next();
        }else {
            const token = header.replace("Bearer ", "");

            // console.log(token);

            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {

                if(decoded == null) {

                    res.status(401).json({ message: "Invalid token..." });
                
                }else{

                    req.user = decoded;
                    next();
                }

            });
        }
       
    }