import express from 'express';
import authRoute from './route/authRoute/authRoute';
import passport from 'passport';
import session from 'express-session';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import apiRoute from './route/apiRoute';
import cors from 'cors'
import { createClient } from 'redis';
import { connectRedis } from './config/redisSetup';

const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log(err));

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    name: 'session',
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

connectRedis();

app.use('/auth', authRoute);
app.use('/api', apiRoute)

app.get('/', (_, res) => {
    res.send(process.env.MONGO_URI);
});

app.listen(4040, () => {
    console.log(`Listening on port http://localhost:4040`);
});