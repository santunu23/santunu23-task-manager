const express=require('express');
require('./db/mongoose')
const app=express();
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
app.use(express.json())
app.use(userRouter);
app.use(taskRouter);

const port=process.env. PORT || 3000
// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.send('GET requests are disabled')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.status(503).send('We are doing our maintenance work,please come to later')
//     }
// })





app.listen(port,()=>{
    console.log("Server is up on port "+port)
})

const Task=require('../modals/tasks')
const User=require('../modals/user')
// const main = async ()=>{
// //Find owner by it's id
// // const task= await Task.findById('62f5fdb6d82b2563a170620d')
// // await task.populate('owner')
// // console.log('My main task '+task)
// // console.log("My owner task "+task.owner)
//     const user= await User.findById('62f5fbc4c9679b7558e0b8b7')
//     await user.populate('tasks')

// }
// main()

//File uploading using multer npm package
const multer=require('multer');
const upload=multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        //Multer npm package filter option to find the file extension.

        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('Please upload a PDF.'))
        // }

        //Use regular expression for file extension.
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document.'))
        }
        cb(undefined,true) 
    }
})
const errorMiddleware=(req,res,next)=>{
    throw new Error('Please upload a word file.')
}
app.post('/upload',errorMiddleware,(req,res)=>{
   res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

// const myFunction=async()=>{
//    const token= jwt.sign({ _id:'abc123' },'thisismynewcourse',{expiresIn: '3 Days'})
//    const data=jwt.verify(token,'thisismynewcourse')
// }

// //Using of hashed password.
// // const myFunction=async()=>{
// //     const password='Red12345!'
// //     const hashedPassword=await bcrypt.hash(password, 8)
// //     const isMatch= await bcrypt.compare('Red12345!',hashedPassword)
   
// // }

// myFunction()