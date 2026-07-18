import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export default function authentication(req, res, next) {
        const header = req.headers["authorization"];
        // console.log(header);

        if(header == null) {
            next();
            return;
        }

        const token = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();

        if (token.length === 0) {
            res.status(401).json({ message: "Invalid token..." });
            return;
        }

        // console.log(token);

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {

            if (err || decoded == null) {

                res.status(401).json({ message: err?.message || "Invalid token..." });
                return;
            }

            req.user = decoded;
            next();

        });

        }
       
    