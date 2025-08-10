import jwt from 'jsonwebtoken';

const authUser = async (req,res,next) => {
    const {token} = req.header;

    if(!token){
        return res.json({success:false,message:'Not Authorize Login Again'})
    }
    try{
        const token_decade = jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = token_decade.id 
        next()
    }catch(error){
        console.log(error)
    }
}

export default authUser 