import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()
export function authUser(req, res, next) {
  const header = req.header("Authorization");
  if (header) {
    const token = header.replace("Bearer ", "");
    jwt.verify(token,process.env.JWT_KEY, (err, decode) => {
      console.log(decode);
      if (decode !== null) {
        req.user = decode;
      
      }
    });
  }
  
  next()
}
