require('dotenv').config();
var API_KEY = process.env.API_key;
var DOMAIN = process.env.API_base_URL;
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

exports.sendEmail = async (sender_email, reciever_email, 
    email_subject, email_body) => {
    const data = { 
        "from": sender_email, 
        "to": reciever_email, 
        "subject": email_subject, 
        "text": email_body 
    }; 
        
    await mailgun.messages().send(data, (error, body) => { 
    if(error) console.log(error) 
    else console.log(body); 
    }); 
};


