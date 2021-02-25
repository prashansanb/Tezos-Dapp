
import importKey from '@taquito/signer';
const express = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
const redis = require("redis");
const app = express();

const redisPort = 6379
const client = redis.createClient(redisPort);

client.on("error", (err) => {
    console.log(err);
})


app.get('/fetchdata', (req, res) => {
    
})

app.get('/photos', (req, res) => {
    const photosRedisKey = 'user:photos';
 
    ///Incase cached
    return client.get(photosRedisKey, (err, photos) => {
 
        // If that key exists in Redis store
        if (photos) {
 
            return res.json({ source: 'cache', data: JSON.parse(photos) })
 
        } else { 
            // Fetch directly from remote api
            fetch('https://jsonplaceholder.typicode.com/photos')
                .then(response => response.json())
                .then(photos => {
 
                    // Save the  API response in Redis store,  data expire time in 3600 seconds
                    client.setex(photosRedisKey, 3600, JSON.stringify(photos))
 
                    // Send JSON response to client
                    return res.json({ source: 'api', data: photos })
 
                })
                .catch(error => {
                    console.log(error)
                    return res.json(error.toString())
                })
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Node server started");
});
