import express from 'express';
import {login , logout , register} from "../controllers/auth.controller.js";


const auth = express.Router();


// Add this route for testing
auth.get('/check', (req, res) => {
    res.send('Auth endpoint is working!');
});

auth.post('/register' , register);


auth.post('/login' , login);

auth.post('/logout' , logout);

export default auth;
