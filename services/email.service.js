const asyncRedis = require('async-redis');
const config = require('../config/config');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const nodemailer = require("nodemailer");

const client = asyncRedis.createClient();

client.on("error", function(error) {
    console.error(error);
});


const sendEmail = async(receptor) => {
    try {
      
      const randomCode = Math.floor(100000 + Math.random() * 900000);
    //   const smsResponse = await sendSmsPromise(receptor, randomCode, template);
      const emailResponse = await sendEmailCode(receptor, randomCode)
      console.log('emailResponse: ', emailResponse.messageId);
  
      const cachedData = {
        code: randomCode,
        // date: smsResponse[0].date,
        reqNumber: 1
      }
  
      const result = await client.set(emailResponse.messageId, JSON.stringify(cachedData));
      console.log('result: ', result);
  
      // setTimeout(async () => { 
      //   await clearVerifyCode(smsResponse[0].messageid);
      // }, 300 * 1000);
  
      if(result !== "OK") {
        throw new ApiError(httpStatus.NO_CONTENT, `some error occured, please try again later.`)
      }
  
      return { messageId: emailResponse.messageId, sender: emailResponse.envelope.from };
      
  
    } catch (error) {
      console.log(error);
    }
  }

  const sendEmailCode = async(username, randomCode) => {
    return new Promise((resolve, reject) => {
        let testAccount = nodemailer.createTestAccount();
  
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          service: 'gmail', 
          auth: {
            user: 'saman.na30ri@gmail.com', // generated ethereal user
            pass: 'sena51iran98', // generated ethereal password
          },
        });
      
        // send mail with defined transport object
        var mailOptions = {
          from: 'saman.na30ri@gmail.com', // sender address
          to: username, // list of receivers
          subject: "Verification Code ✔", // Subject line
          text: "Thanks For Your Truth", // plain text body
          html: `<b>Verification Code is : ${randomCode}</b>`, // html body
        };
      
        transporter.sendMail(mailOptions, function (error, info) {
          if(error) { console.log(error) }
          else { resolve(info); }
        })
    })
  };


async function sendSmsPromise(receptor, token, template) {
  return new Promise((resolve, reject) => {
    try {

      api.VerifyLookup({
        receptor:receptor,
        token:token,
        template:template
      }, function(response, status) {
        resolve(response);
        
      });
    } catch (error) {
      reject(error);
    }
  });
}




// TODO: check date
async function checkVeifyCode( verifyCode, messageId) {
  
  try {
    if(!verifyCode) { return `PleaseSpecifyVerifyCodeParam`; }
  // const verifyRes = await verifyCodeHelper(messageId);
  // if(!verifyRedis) { return `PleaseSendAnotherSMS`; }

  const verifyRedis = await client.get(messageId);
  const code = JSON.parse(verifyRedis).code;
  // const req = JSON.parse(verifyRedis).reqNumber;
  // const recievedDate = JSON.parse(verifyRedis).date;
  // await client.set(verifyRes[0].messageid, JSON.stringify({...JSON.parse(verifyRedis), reqNumber: req + 1}));
  // const newVerifyRedis = JSON.parse(await client.get(verifyRes[0].messageid));
  if(parseInt(code) !== parseInt(verifyCode)) { return `VerifyCodeIsNotCurrect`; }
  // await clearVerifyCode(messageId);
  return true;
  } catch (error) {
    console.log(error);
  }

};


async function verifyCodeHelper(messageId) {
  return new Promise((resolve, reject) => {
    try {
      api.Status({
        messageid: messageId
      }, function(response, status) {
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function clearVerifyCode(messageId) {
  return await client.del(messageId);
}

module.exports = {
  sendEmail,
  sendSmsPromise,
  checkVeifyCode,
  verifyCodeHelper,
  clearVerifyCode,
};