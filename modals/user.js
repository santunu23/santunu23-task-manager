const mongoose=require("mongoose")
const validator=require("validator")
const Task=require("../modals/tasks")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isByteLength(value,{min:6})){
                throw new Error("Password field should be 6 field long.")
            }else if(validator.equals(value.toLowerCase(),'password')){
                throw new Error('Password cannot contain "Password"')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    age:{
        type: Number ,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required:  true,
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    "timestamps":true
})
// Implement a virtual attribute for two entity(in our project two collections tasks and users)
userSchema.virtual('tasks',{
    ref: Task, 
    localField: '_id',
    foreignField:  'owner'
})
userSchema.methods.generateAuthToken= async function(){
        const user=this
        const token=jwt.sign({ _id:user._id.toString()},process.env.JWT_SECRET)
        user.tokens=user.tokens.concat({token:token})
        await user.save()
        return token
}

userSchema.methods.toJSON=async function(){
    const user=this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials=async (email,password)=>{
    const user= await User.findOne({email:email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch=await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user;
}
//Implementation of middleware
userSchema.pre('save', async function(next){
    const user=this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }
    next()
})
//Delete user tasks when user is remove using middleware
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model('User',userSchema)

module.exports=User