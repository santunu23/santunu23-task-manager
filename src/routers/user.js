const express=require('express')
const User=require('../../modals/user')
const router=new express.Router()
const auth=require('../middleware/auth')
const multer=require('multer');
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelEmail }=require('../email/account')

//Get users
router.get('/users/me',auth, async (req,res)=>{
    console.log(req.user)
     res.send(req.user)
    // try{
    //      const users=await User.find({})
    //      res.send(users)
    //  }catch(e){
    //      res.status(500).send()
    //  }
 
     //Using the promise chaining
 
     // User.find({}).then((users)=>{
     //     res.send(users)
     // }).catch((e)=>{
     //     res.status(500).send()
     // })
 })

//POST users
router.post('/users', async (req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    //Using the Promise chaining
   // user.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // }) 
})

router.post('/users/login', async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateAuthToken()
        res.send({ user, token })
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send
    }
})
router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send
    }
})
router.patch('/users/me',auth, async(req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdate=['name','email','password','age']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdate.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates'})
    }
    try{
       // const user=await User.findByIdAndUpdate(req.params.id,  req.body, { new : true,runValidators:true })
      //  const user= await User.findById(req.params.id)
       updates.forEach((update) =>req.user[update] = req.body[update]) 
       await req.user.save()
        res.send(req.user)
    }catch(e){
            res.status(400).send()
    } 
})
//Delete operation in User modal
router.delete('/users/me', auth, async(req,res)=>{
    try{
        // const user =await User.findByIdAndDelete(req.user._id)
        // res.send(user)
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.name)
        res.send(req.user)
    }
    catch{
        res.status(500).send()
    }
})

//File upload using multer 
const upload=multer({
    // dest: 'avatar',
    limit:{
        filesize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image with valid file extension(jpg,jpeg,png)'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/upload',auth,upload.single('upload'), async (req,res)=>{
    const buffer=await  sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async(req,res)=>{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.send()
    }catch(e){
        res.status(400).send()
    }
})

router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error("Problem arise")
        }
        res.set('Content-Type', ' image/png')
        res.send(user.avatar) 

    }catch(e){
        res.status(400).send()
    }
})

module.exports=router