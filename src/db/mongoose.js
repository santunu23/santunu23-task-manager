const mongoose=require("mongoose")


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true
})

// const User=mongoose.model('User',{
//     name:{
//         type: String,
//         required:true,
//         trim:true
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true,
//         validate(value){
//             if(!validator.isByteLength(value,{min:6})){
//                 throw new Error("Password field should be 6 field long.")
//             }else if(validator.equals(value.toLowerCase(),'password')){
//                 throw new Error('Password cannot contain "Password"')
//             }
//         }
//     },
//     email:{
//         type: String,
//         required: true,
//         trim:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("Email is invalid")
//             }
//         }
//     },
//     age:{
//         type: Number ,
//         default:0,
//         validate(value){
//             if(value<0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })

// const me=new User({
//     name: '  Indrajit    ',
//     email:'indrajit@gmail.com',
//     password:'Password'
// })

// me.save().then(()=>{
// console.log(me)
// }).catch((error)=>{
//     console.log('Error',error)
// })

// const tasks= mongoose.model('tasks',{
//     description:{
//         type:String
//     },
//     completed: {
//         type:Boolean
//     } 
// })

// const mytask=new tasks({
//     description: "Purchase Grossary",
//     completed: false
// })

// mytask.save().then(()=>{
// console.log(mytask)
// }).catch((error)=>{
//     console.log(error)
// })