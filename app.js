const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();



const { PORT, MONGODB_URI, NODE_ENV, ORIGIN } = require("./config");
const { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } = require("./errors");

// init express app
const app = express();





app.use(express.json());
app.use(
    cors({
        credentials: true,
       // origin: ORIGIN,
        optionsSuccessStatus: 200,
    })
);



// log in development environment

if (NODE_ENV === "development") {
    const morgan = require("morgan");
    app.use(morgan("dev"));
}

// index route

app.get("/", (req, res) => {
    res.status(200).json({
        type: "success",
        message: "server is up and running",
        data: null,
    });
});



// routes
const authRoutes = require("./routes/api");
app.use("/api/auth", authRoutes);


// page not found error handling  middleware

app.use("*", (req, res, next) => {
    const error = {
        status: 404,
        message: API_ENDPOINT_NOT_FOUND_ERR,
    };
    next(error);
});

// global error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || SERVER_ERR;
    const data = err.data || null;
    res.status(status).json({
        type: "error",
        message,
        data,
    });
});

async function main() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
           // useCreateIndex: true,
           // useFindAndModify: false,
           // useUnifiedTopology: true,
        });

        console.log("database connected");

        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

 main();
// var accountSid = 'AC2fec303172327cc8c85d1934647adb6c';
// var authToken = '881c69db81d695cd5b1aca7e04c22ed1';


// const client = require('twilio')(accountSid, authToken);

// try {
//     const message =  client.messages.create({
//         body: 'Hello from Node',
//         to: '+8801740447359',
//         from: '+8801740447359',
//     });
//     console.log(message);
// } catch (error) {
//     // You can implement your fallback code here
//     console.error(error);
// }

// client.messages
//     .create({
//         body: 'Hello from twilio-node',
//         to: '+8801740447359', // Text your number
//         from: '+17312566223', // From a valid Twilio number
//     })
//     .then((message) => console.log(message.sid));




