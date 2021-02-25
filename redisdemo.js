
import TezosToolkit  from '@taquito/taquito';
import InMemorySigner from '@taquito/signer';
import importKey from '@taquito/signer';
const express = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
const redis = require("redis");
const app = express();

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');
Tezos.tz
  .getBalance('tz1Zq86VbqKKjgjNeaKUXfBTmgMfPjWgeTnK')
  .then((balance) => println(`${balance.toNumber() / 1000000} ꜩ`))
  .catch((error) => println(JSON.stringify(error)));



const redisPort = 6379
const client = redis.createClient(redisPort);

client.on("error", (err) => {
    console.log(err);
})


app.get('/fetchdata', (req, res) => {
    
})

app.get('/photos', (req, res) => {
    const photosRedisKey = 'user:photos';
 
    // Try fetching the result from Redis first in case we have it cached
    return client.get(photosRedisKey, (err, photos) => {
 
        // If that key exists in Redis store
        if (photos) {
 
            return res.json({ source: 'cache', data: JSON.parse(photos) })
 
        } else { // Key does not exist in Redis store
 
            // Fetch directly from remote api
            fetch('https://jsonplaceholder.typicode.com/photos')
                .then(response => response.json())
                .then(photos => {
 
                    // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
                    client.setex(photosRedisKey, 3600, JSON.stringify(photos))
 
                    // Send JSON response to client
                    return res.json({ source: 'api', data: photos })
 
                })
                .catch(error => {
                    // log error message
                    console.log(error)
                    // send error to the client 
                    return res.json(error.toString())
                })
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Node server started");
});
