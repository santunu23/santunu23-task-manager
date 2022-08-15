const express=require('express')
const Task=require('../../modals/tasks')
const router=new express.Router()
const auth=require('../middleware/auth')


//Implementation Task modal
//Create tasks with out auth
// router.post('/tasks', async (req,res)=>{
//     const task=new Task(req.body)
//     try{
//         await task.save()
//         res.status(201).send(task)
//     }catch(e){
//         res.status(400).send(e)
//     }
  

//     //Using the promise chaining
//     // task.save().then(()=>{
//     //     res.send(task)
//     // }).catch((e)=>{
//     //     res.status(200).send(e)
//     // })
// })

router.post('/tasks',auth,async (req,res)=>{
    //const task=new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
  

    //Using the promise chaining
    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(200).send(e)
    // })
})
// Goal: Setup the task reading endpoint
// 1. Create an endpoint for fetching all tasks.
// 2. Create an endpoint for featcing a tasks by its id.
// 3. Setup new requests in postman and test your work.
router.get('/tasks', auth, async (req,res)=>{
    const match={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc' ? -1:1
    }
    try{
         await req.user.populate({
                path: 'tasks' ,
                match,
                options:{
                    //limit:2
                    limit:parseInt(req.query.limit),
                    skip:parseInt(req.query.skip),
                    sort
                    // sort:{
                    //     //createdAt:1
                    //     completed: -1
                    // }
                }
            })
        // const tasks=await  Task.find({owner:req.user._id,match})
        res.send(req.user.tasks) 
    }catch(e){
        res.status(400).send(e)
    }
    Task.find({}).then((tasks)=>{
        res.send(tasks)
    }).catch((e)=>{
        res.status(500).send()
    })
})

//GET /tasks?limit=10&skip=0



router.get('/tasks/:id',auth,async (req,res)=>{
   const _id=req.params.id;
   try{
    //const tasks= await Task.findById(_id)
     const task= await Task.findOne({_id, owner:req.user._id})
    if(!task){
        return res.status(404).send()
    }
    res.send(task)
   }catch(e){
       res.status(400).send(e)
   }
    
//    const tasks=new Tasks()
//     // Task.findById(_id).then((task)=>{
//     //     console.log(task)
//     //     if(!task){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(task)
//     // }).catch((e)=>{
//     //     req.status().send()
//     // })
})
//Update task 
router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdate=['description','completed']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdate.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send();
    }
    try{
        // const task= await Task.findByIdAndUpdate(req.params.id,  req.body, { new : true,runValidators:true })
            //const task= await Task.findById(req.params.id)
           
            const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
           if(!task){
            return res.status(400).send()
           }
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send(task)
    }catch(e){
        return res.status(400).send(e);
    }
})
//Delete Tasks
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router