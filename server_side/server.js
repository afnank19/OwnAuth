const express = require('express')
const admin = require('firebase-admin');

var serviceAccount = require('./secret/ownauth-3d374-firebase-adminsdk-slbqo-e2ead287f2.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
const db = admin.firestore();

const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`)
})