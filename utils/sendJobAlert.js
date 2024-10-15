const nodemailer = require('nodemailer')

const sendEmailNotification = async (sendUserEmail,emailList,subject,message) => {
    try {

        console.log(sendUserEmail)
        const emailString = emailList.join(',');
        console.log(emailString)
        const transport = nodemailer.createTransport({
            host:process.env.HOST,
            service:process.env.SERVICE,
            port:Number(process.env.EMAIL_PORT),
            secure:Boolean(process.env.SECURE),
            auth:{
                user:process.env.USER,
                pass:process.env.PASS
            }
        })

        await transport.sendMail({
            from:"kirancoder007@gmail.com",
            to:emailString,
            subject:subject,
            text:message
        })
        console.log("email send successfully")
    } catch (error) {
        console.log("email not sent")
        console.log(error)
        return error
    }
}

module.exports = sendEmailNotification