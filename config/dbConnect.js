const { default: mongoose } = require('mongoose');

const dbConnect = () => {
    mongoose.set('strictQuery', true);
    mongoose.createConnection
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to DB');
    }).catch((error) => {
        console.log("db error: ", error);
    });




    // try {
    //     // mongoose.set('strictQuery', true);
    //     mongoose.connect(process.env.MONGODB_URL);
    //     console.log('Connected to DB');
    // } catch (error) {
    //     console.log("db error: ", error);
    // }
};

module.exports = dbConnect;