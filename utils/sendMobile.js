const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

const sentMobileOtp = async(res,otp,phoneNumber) => {
    
    try {
        // Send the SMS with Twilio
        const message = await client.messages.create({
          body: `Your OTP code is ${otp}`,
          from: '+19108174273',
          to: `+91${phoneNumber}`,
        });
    
       
      } catch (error) {
        console.error('Error sending OTP SMS:', error);
        return res.status(500).send('Error sending OTP SMS.');
      }
    }



module.exports = sentMobileOtp