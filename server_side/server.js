const express = require('express')
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var serviceAccount = require('./secret/ownauth-3d374-firebase-adminsdk-slbqo-e2ead287f2.json');

//Testing
// const hash = crypto.createHash('sha256')
// const data = 'afnank19';
// hash.update(data);
// const digest = hash.digest('hex');
// console.log(digest);

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

        //validate user password
        let inputPassword = bodyData.password;
        let hashedPword =  hashPassword(inputPassword, dbSalt);

        if(hashedPword != dbPassword) {
            console.log("password issue")
            res.status(400).send("Passwords did not match!");
        } else {
            res.status(200).send("Login Validated");
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
        await userRef.doc().set(userData);
        console.log("set data");

        res.status(201).send("New user registered");
    } catch (error) {
        console.log("FAIL")
        res.status(500).send(error);
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

//Test code:
const PRIVATE_KEY = 'malenia'

app.post('/tokenTest', async (req, res) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader.split(' ')[1];

    console.log(token);

    
    try {
        //Verify the JWT, and check respones based on expiration
        const decoded = jwt.verify(token, PRIVATE_KEY);

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
        }, PRIVATE_KEY, {expiresIn: '2min'})

        console.log(testToken);

        let data = { accessToken: testToken}

        res.status(200).send(data);
    } catch (error) {
        
    }
})