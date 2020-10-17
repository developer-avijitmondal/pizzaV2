var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.render('index', { title: 'Pizza App' });
    var API_KEY = process.env.API_key;
    var DOMAIN = process.env.API_base_URL;
    var mailgun = require('mailgun-js') 
          ({apiKey: API_KEY, domain: DOMAIN}); 
  
    sendMail = function(sender_email, reciever_email, 
            email_subject, email_body){ 
      
      const data = { 
        "from": sender_email, 
        "to": reciever_email, 
        "subject": email_subject, 
        "text": email_body 
      }; 
        
      mailgun.messages().send(data, (error, body) => { 
        if(error) console.log(error) 
        else console.log(body); 
      }); 
    } 
      
    var sender_email = 'sender@gmail.com'
    var receiver_email = 'developer.avijitmondal@gmail.com'
    var email_subject = 'Mailgun Demo'
    var email_body = 'Greetings from geeksforgeeks'
      
    // User-defined function to send email 
    sendMail(sender_email, receiver_email,  
                email_subject, email_body)

});

module.exports = router;
