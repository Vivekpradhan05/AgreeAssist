import jwt from 'jsonwebtoken';

 const authUser = async (req, res, next)=>{
    
     const {token} = req.cookies;

     // if token is not available the res .
     if(!token){
         return res.json({ success:false, message:'Not Authorized' });
     }

     try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
          //  req.body.userId = tokenDecode.id;
             req.user = { id: tokenDecode.id };  // ✅ attach to req.user
        } else{
               return res.json({ success:false, message:'Not Authorized' });
        }
        next();


     }  catch( error ){
           return res.json({ success:false, message:error.message });
     }

 }


 export default authUser;