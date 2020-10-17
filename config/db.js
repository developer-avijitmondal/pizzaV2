var mongoose = require('mongoose');

require('dotenv').config();

var dbURL = process.env.mongoURL;

// mongoose.connect(dbURL,{ useNewUrlParser: true });
 
// var db = mongoose.connection;
 
// db.on('error', console.error.bind(console, 'connection error:'));
 
// db.once('open', function() {
//   console.log("Connection Successful!");
// });

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL,
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false,
            //useUnifiedTopology: true
        })
        // {
        //     useCreateIndex: true,
        //     useNewUrlParser: true,
        //     useFindAndModify: false,
        //     useUnifiedTopology: true
        // });
        console.log('mongo connected...');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
