const dotenv = require('dotenv');
const express = require('express')
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

dotenv.config();

//console.log(process.env.PRIVATE_KEY);

var serviceAccount = require('./secret/ownauth-3d374-firebase-adminsdk-slbqo-e2ead287f2.json');
const { timeStamp } = require('console');
//const { error } = require('console');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
const db = admin.firestore();

const app = express()
app.use(bodyParser.json());
const PORT = 3000

app.get('/', (req, res) => {
  res.send('Server is up and alive.')
})

app.post('/login',async (req, res) => {
    const bodyData = req.body;
    console.log(bodyData);

    //fetch the password from firestore
    try {
        let email = bodyData.email;

        const userRef = db.collection('users');
        const queryRes = await userRef.where('email', '==', email).get();
        const dbPassword = queryRes.docs[0].data().password;
        const dbSalt = queryRes.docs[0].data().salt;

        console.log(queryRes.docs[0].id);

        //validate user password
        let inputPassword = bodyData.password;
        let hashedPword =  hashPassword(inputPassword, dbSalt);

        if(hashedPword != dbPassword) {
            console.log("password issue")
            res.status(400).send("Passwords did not match!");
        } else {
            //if password is valid
            let tokenData = {
                userID: queryRes.docs[0].id
            }
            let data = GenerateTokens(tokenData);

            res.status(200).send(data);
        }
    } catch (error) {
        res.status(500).send("err");
    }


    //return OK or ERROR
})

app.post('/register', async (req, res) => {
    const bodyData = req.body;
    console.log("Attempting Register");
    console.log(bodyData);

    try {
        const userRef = db.collection('users');

        //Hash the passwords with the salt
        let inputPassword = bodyData.password;
        let salt = generateSalt();
        let hashedPword = hashPassword(inputPassword, salt);

        const userData = {
            "username": bodyData.username,
            "email": bodyData.email,
            "password": hashedPword,
            "salt": salt
        }
        //Set the new data into the collection.
        const docRef = await userRef.add(userData);
        console.log("set data with id: " + docRef.id);

        //Create the token
        let tokenData = {
            userID: docRef.id
        }
        let data = GenerateTokens(tokenData);

        //send the token for future requests
        res.status(201).send(data);
    } catch (error) {
        console.log("FAIL")
        res.status(500).send(error);
    }
})

app.get('/homepage', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];

    console.log(token);
    
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

        // if(decoded == undefined) {
        //     console.log("invalid token? expired perhaps!")
        //     throw new error;
        // }

        console.log(decoded.userID);

        const userRef = db.collection('users').doc(decoded.userID);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            res.status(404).send("Not found");
            return;
        } else {
            res.status(201).send(userDoc.data()); //this sends hashed passwords too, mush be changed
            return;
        }
        
    } catch (error) {
        console.log(error);

        if(error.name === 'TokenExpiredError') {
            console.log("expired token")
            res.status(401).send(error);
        } else { 
            res.status(500).send(error);
        }        
    }
})

app.get('/user/tweets', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];

    try {
        //const decoded = jwt.verify(token, process.env.REFRESH_KEY)

        const followingSnapshot = await admin.firestore().collection('users').doc('KPH3P3bkjU7bZT4GjBq3').collection('following').get();
        const followingUsers = followingSnapshot.docs.map(doc => doc.data());

        const tweetsPromises = followingUsers.map(async user => {
            const tweetsSnapshot = await admin.firestore().collection('tweets').where('username', '==', user.username).get();
            return tweetsSnapshot.docs.map(doc => doc.data());
        });
      
        const tweets = await Promise.all(tweetsPromises);

        res.status(200).json(tweets);

    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            console.log("expired token")
            res.status(401).send(error);
        } else { 
            res.status(500).send(error);
        }
    }
})

app.get('/user/search/:username', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];

    const username = req.params.username;

    try {
        //const decoded = jwt.verify(token, process.env.REFRESH_KEY)

        const usersSnapshot = await admin.firestore().collection('users')
        .where('username', '>=', username)
        .where('username', '<', username + '\uf8ff') // Inclusive search for usernames starting with 'username'
        .get();

        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

        res.json(users);
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            console.log("expired token")
            res.status(401).send(error);
        } else { 
            res.status(500).send(error);
        }
    }
})

app.post('/user/tweet', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];

    const bodyData = req.body;

    try {
        //const decoded = jwt.verify(token, process.env.REFRESH_KEY)

        const tweet = {
            body: bodyData.body,
            username: bodyData.username,
            timeStamp: getCurrentTimeAndDate()
        }

        await admin.firestore().collection('tweets').add(tweet);

        res.status(201).json({status: 1});
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            console.log("expired token")
            res.status(401).send(error);
        } else { 
            res.status(500).send(error);
        }
    }
})

app.post('/user/follower/:username', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];

    const requesterUsername = req.params.username;
    const bodyData = req.body;

    try {
        //const decoded = jwt.verify(token, process.env.REFRESH_KEY)

        await admin.firestore().collection('users').doc('KPH3P3bkjU7bZT4GjBq3').collection('following').doc().set({
            userID: bodyData.userID,
            username: bodyData.username
        });

        await admin.firestore().collection('users').doc(bodyData.userID).collection('followers').doc().set({
            userID: "KPH3P3bkjU7bZT4GjBq3",
            username: requesterUsername
        })

        res.status(201).json({status: 1});
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            console.log("expired token")
            res.status(401).send(error);
        } else { 
            res.status(500).send(error);
        }
    }
})

app.get('/refresh', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];
    console.log("Refresh: " + token);

    try {
        //Check if refresh token is expired
        const decoded = jwt.verify(token, process.env.REFRESH_KEY)
        tokenData = {
            userID: decoded.userID 
        }

        let data = GenerateTokens(tokenData);
        console.log("new tokens: " + data);

        res.status(200).send(data)
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            console.log("expired token")
            res.status(401).send(error);
        } else { 
            res.status(500).send(error);
        } 
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} | url: http://localhost:3000`)
})


//Helper functions:
function generateSalt(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    return hash.digest('hex');
}

function GenerateTokens(tokenData) {
    var accessToken = jwt.sign(tokenData, process.env.PRIVATE_KEY, {expiresIn: '15min'});
    var refreshToken = jwt.sign(tokenData, process.env.REFRESH_KEY, {expiresIn: '10d'});

    let data = {
        accessToken: accessToken,
        refreshToken: refreshToken
    }

    return data;
}
function getCurrentTimeAndDate() {
    const now = new Date();
  
    // Format the time and date
    const options = { hour: 'numeric', minute: '2-digit' };
    const timeString = now.toLocaleTimeString('en-US', options);
  
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
  
    return `${timeString} ${dateString}`;
  }

//Test code:

app.post('/tokenTest', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];

    console.log(token);

    
    try {
        //Verify the JWT, and check respones based on expiration
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

        console.log(decoded);
        
        let data = { token: decoded.username};

        res.status(200).send(data);
    } catch (error) {
        
    }
})

app.post('/getToken', async (req, res) => {
    const body = req.body;

    try {

        var testToken = jwt.sign({
        username: body.user
        }, process.env.PRIVATE_KEY, {expiresIn: '10min'})

        console.log(testToken);

        let data = { accessToken: testToken}

        res.status(200).send(data);
    } catch (error) {
        
    }
})