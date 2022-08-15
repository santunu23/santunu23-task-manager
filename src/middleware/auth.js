const jwt=require('jsonwebtoken')
const User=require('../../modals/user')

const auth=async(req,res,next)=>{
    try{
        //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmY0NjMzZjI2NjgwNmQ0ZjU2N2VhODciLCJpYXQiOjE2NjAxODM2NTV9.vnDjmLm6GV2wiNWIYbN7Qy5GMeGucuJbt2CPHcGFvco
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
       // req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate. '})
    }
}

module.exports=auth