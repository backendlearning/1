# I am learning to create an backend from scratch for metasploite.

Doing it by following a series first to learn to learn.
- [Model link](https://app.eraser.io/invite/Ppozd8OXjqTzr1RUbOBH)

# Firstly let me tell you I am using node with mongodb with some secure coding practice and this is the documentation for youtube-backend
 packeges used for the backend 
- mongoose
- express
- cors
- nodemon
- dotenv
- cookie-parser
- multer
- cloudinary
- bcrypt
- jsonwebtoken
- mongoose-aggregate-paginate-V2
-- visit [mongoose](https://www.npmjs.com/package/mongoose-aggregate-paginate-v2) for more info
 ## # created an database connection in secure and intractive way for communicating

```Javascript
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";

const app = express()

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        // app.listen(process.env.PORT, () => {
        //     console.log(`App is listning on ${process.env.PORT}`)
        //    })
        console.log(`\n MongoDb connected || DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("error", error)
        // throw err
        process.exit(1)
    }
}

export default connectDB
```

# calling that connection

```javascript
// require('dotenv').config({path: './env'})

import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./database_connectivity/index.js";

dotenv.config({
    path:'./env'
})


connectDB()


```
#### Project Backend Running on PORT: 42386
#### Front-End is available on PORT: 8000
### user prettier extension & package for code maintanance

```Important information
we use app.use() for middleware or any configuration settings in express.Well it is used with Cors and if you are working with backend you know about middleware It's Just like an API Web Scrapping
```
### Most likely cors define an url to accept request from an particular domain
This example enable all cors request
ex-`1`
```javascript
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})
 
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
```
ex-2
```javascript
// with Dynamic origin
const express = require('express')
const cors = require('cors')
const app = express()
 
const whitelist = ['http://example1.com', 'http://example2.com']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
 
app.get('/products/:id', cors(corsOptions), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
})
 
app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
```

