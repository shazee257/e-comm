const express = require('express');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const api = require('./routes');
const cookieParser = require('cookie-parser');

dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", api);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


