const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')

const sendEmailNotification = async (sendUserEmail,emailList,subject,message,endDate) => {
    try {

        // console.log(sendUserEmail)
        // const emailString = emailList.join(',');
        // console.log(emailString)

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

        // Sending emails one by one

        for(let i=0;i<emailList.length;i++){
                    const html = await ejs.renderFile(path.join(__dirname,'..','views','emailTemplate.ejs'),
                {message,endDate}
            )

            await transport.sendMail({
                from:"kirancoder007@gmail.com",
                to:emailList[i],
                subject:subject,
                html:html
            })

            console.log("email send successfully")

        }

        


       
       
    } catch (error) {
        console.log("email not sent")
        console.log(error)
        return error
    }
}

module.exports = sendEmailNotification