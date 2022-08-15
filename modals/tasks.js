const mongoose=require("mongoose")
const validator=require("validator")

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim: true,
        validate(value){
            if(!validator.isByteLength(value,{min:6})){
                throw new Error("Description field length more then 6.")
            }
        }
    },
    completed: {
        type:Boolean,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{
    timestamps:true
})

const Task= mongoose.model('tasks',taskSchema)

module.exports=Task