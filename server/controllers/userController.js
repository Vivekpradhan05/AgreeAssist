// Register User : /api/user/register
import bcrypt from 'bcryptjs';
import User from "../models/user.js";
import jwt from 'jsonwebtoken';


// Register user : /api/user/register
export const register = async (req,res)=>{
    try{
        const { name, email, password} = req.body;

        if( !name || !email || !password){
            return res.json({success:false, message:'Missing Details'})
        }
         
        // if any user existing allready for that this is used
        const existingUser = await User.findOne({email})

        if(existingUser)
            return  res.json({success:false, message:'User allready exists'})
        

        const hashedPassword = await bcrypt.hash(password, 10)


        const user= await User.create({name, email, password:hashedPassword})

        const token = jwt.sign({id:user._id} , process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true,     // Prevent Javascript to Access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time

        });

         return res.json({success:true, user:{email: user.email, name:user.name}});
    
    
    } catch(error){
            console.log(error.message);
            res.json({success:false, message:error.message});
    }
}



// Login user : /api/user/login

export const login = async (req,res)=>{

    try{
       
         const {email, password} = req.body;
          // if email and password dont correct 
         if( !email || !password)
            return res.json({ success: false, message: 'Email and passord are required'});

         const user= await User.findOne({email});

         if( !user ){
             return res.json({ success: false, message:  'Invalid Email and password '});
         }


         // if password is not matching 
         const isMatch = await bcrypt.compare(password, user.password)

         if(!isMatch)
             return res.json({ success: false, message:  'Invalid Email or password '});

        // ifj password is matching 
          const token = jwt.sign({id:user._id} , process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === 'production',
            sameSite:  process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000,

        });

         return res.json({success:true, user:{email: user.email, name:user.name}});


    } catch(error){
           console.log(error.message);
           res.json({success:false, message:error.message});
    }
}


// Check Auth :  /api/user/is-auth

export const isAuth = async (req,res)=>{
    try{
       // const { userId } = req.body;
        const userId = req.user.id;   // ✅ comes from middleware
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error){
         console.log(error.message);
         res.json({success:false, message:error.message});
    }
}


// Logout user: /api/user/logout

export const logout = async (req,res)=>{

    try{
           res.clearCookie('token',{
             httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
           });
           return res.json({success: true, message: "Logged Out"})
    } catch (error){
         console.log(error.message);
         res.json({success:false, message:error.message });
    }
}