require('dotenv').config();
var API_KEY = process.env.API_key;
var DOMAIN = process.env.API_base_URL;
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});
var mg = require('nodemailer-mailgun-transport');
var nodemailer = require('nodemailer');

// exports.sendEmail = async (sender_email, reciever_email, 
//     email_subject, email_body) => {
//     const data = { 
//         "from": sender_email, 
//         "to": reciever_email, 
//         "subject": email_subject, 
//         "text": email_body 
//     }; 
        
//     await mailgun.messages().send(data, (error, body) => { 
//     if(error) console.log(error) 
//     else console.log(body); 
//     }); 
// };

exports.sendEmail = async (reciever_email) => {
    var transporter = nodemailer.createTransport(
        {
            service: 'Gmail',
            auth: {
                user: 'developer.avijitmondal@gmail.com',
                pass: 'ypihfrlhwipdrdvq'
            }
        });
    
        // setup e-mail data with unicode symbols
        var mailOptions = {
        from: '"Pizza" <pizza@info.com>', // sender address
        to: reciever_email, // list of receivers
        subject: 'Pizza Ordered', // Subject line
        text: 'Your Order Placed successfully',
        //err: 'isError'
        
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('\nERROR: ' + error+'\n');
            //   res.json({ yo: 'error' });
            return error;
        } else {
            console.log('\nRESPONSE SENT: ' + info.response+'\n');
            //   res.json({ yo: info.response });
            return true;
        }
        });
};


