import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config';
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken';
// mongoose data schemas.
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import User from './Schema/User.js';
import aws from "aws-sdk";

// initializing the firebase

import serviceAccountKey from "./next-f7741-firebase-adminsdk-qkw2l-d2f3f0f3f1.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})
  
const server = express();
const PORT = process.env.PORT || 3000;
const slatRounds = 10; // slat rounds for bcryptjs

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true, 
})

// middlewares
server.use(express.json()); // enable JSON sharing 
server.use(cors());

// AWS setup
const s3 = new aws.S3({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// functions
// generate link to upload image
const generateUploadURL = async () => {

    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'next-kim-blog', 
        Key: imageName, 
        Expires: 1000, 
        ContentType: 'image/jpeg'
    })

}

const formatLoginDataTojson = (user) => {
    // Sign the JWT token with the correct secret key
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);

    return {
        access_token: access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    };
}


const generateUsername = async (email) => {
    let username = email.split('@')[0];
    let isUsernameUnique = await User.exists({ "personal_info.username": username }).then((result) => {
        return result;
    })
    
    isUsernameUnique ? username += nanoid() : "";

    return username;
}

// server routes

server.get('/get-upload-url', (req, res) => {
    generateUploadURL().then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
        console.log(err.message);
        return res.status(200).json({ error: err.message })
    })
})


server.post('/signup', (req, res) => {

    let { fullname, email, password } = req.body;

    // validating the data 

    if (fullname.length < 3) {
        return res.status(403).json({ error : 'Full name should be at least 3 letters long'});
    }
    if (!email.length) {
        return res.status(403).json({ error : 'Enter Email'});
    } 
    if (!emailRegex.test(email)) {
        return res.status(403).json({ error : 'Email is invalid'});
    } 
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ error : 'Password should be 6 to 20 characters long with at least 1 numeric, 1 lowercase and 1 uppercase letter'})
    }

    // encrypting password before storing it to database
    bcrypt.hash(password, slatRounds, async (err, hashed_password) => {

        let username = await generateUsername(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username}
        })

        user.save().then((u) => {

            return res.status(200).json(formatLoginDataTojson(u));

        }).catch(err => {

            if(err.code == 11000) { // duplicate key found
                return res.status(409).json({ error: 'Email already exists' });
            }

            res.status(500).json({ error: err.message })

        })

    })

    // res.json({ msg: "server got the data"});

})

server.post('/signin', (req, res) => {

    let { email, password } = req.body;

    User.findOne({ "personal_info.email" : email })
    .then((user) => {
        
        if(!user.google_auth){

            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Error Occured while login please try again" })
                }
    
                if(!result) {
                    res.status(403).json({ error: "Incorrect Password" })
                } else { // correct password
                    return res.status(200).json(formatLoginDataTojson(user));
                }
                
            });

        } else{
            res.status(403).json({ error: "Account was created using google. Try logging with google" })
        }
        
    })
    .catch(err => {
        console.log(err)
        res.status(403).json({ error: "Email not found"})
    })

})

server.listen(PORT, () => {
    console.log('listening on port -> ' + PORT)
});

server.post('/google-auth', async (req, res) => {
    
    let { accessToken } = req.body;

    getAuth()
    .verifyIdToken(accessToken)
    .then(async (decodedToken) => {

            let { email, name , picture } = decodedToken;

            picture = picture.replace("s96-c", "s384-c")

            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
                return u || null;
            }).catch(err => {
                return res.status(500).json({ error: err.message })
            })

            if(user) { // login
                if (!user.google_auth){
                    return res.status(403).json({ error: "This email was signed up without google. Please login with password to access the account"})
                }
            }
            else { // signup

                let username = await generateUsername(email);

                user = new User({
                    personal_info: { fullname: name, email, username, profile_img: picture },
                    google_auth: true,
                })
            
                await user.save().then((u) => {
                    console.log(u)
                    user = u;

                }).catch(err => {
                    return res.status(500).json({ error: err.message })
                })

            }
            
            return res.status(200).json(formatLoginDataTojson(user));

    })
    .catch((err) => {
        // Handle err
        console.log(err.message);
        return res.status(500).json({ error: 'Failed to authenticate you with google. Try with some other google account' });
    });
})

