const sgmail=require('@sendgrid/mail')
sgmail.setApiKey(process.env.SENDGRID_API_KEY)

//Sending an email
// sgmail.send({
//     to:'santunu23@gmail.com',
//     from:'santunu23@outlook.com',
//     subject:'This is my first email',
//     text:'This is a test mail'    
// }).then(()=>{
//     console.log('Email send')
// }).catch((error)=>{
//     console.log(error)
// })

const sendWelcomeEmail=(email,name)=>{
    sgmail.send({
            to:email,
            from:'santunu23@outlook.com',
            subject:'Thanks in joining in.',
            text: `Welcome to the app ${name}.Let me know how you get along with the app.`    
        }).then(()=>{
            console.log('Email send')
        }).catch((error)=>{
            console.log(error)
        })
}
const sendCancelEmail=(email,name)=>{
        sgmail.send({
            to:email,
            from:'santunu23@outlook.com',
            subject:'Goodbye',
            text: `Goodbye ${name}.We will miss you.`    
        }).then(()=>{
            console.log('Email send')
        }).catch((error)=>{
            console.log(error)
        })
}

module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}