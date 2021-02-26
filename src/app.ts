
import express from 'express';
var taquito = require("@taquito/taquito")
const redis = require("redis");
const axios = require('axios');
const fetch = require("node-fetch");
const app = express();
const port = 3000;


const tezos = new taquito.TezosToolkit('https://delphinet.smartpy.io');

const redisPort = 6379
const client = redis.createClient(redisPort);
client.on("error", (err) => {
    console.log(err);
})

async function fetchfrombchain() {
    console.log('fetchfrombchain indexer called');
    let res = await axios.get('https://better-call.dev/v1/bigmap/delphinet/75796/keys');
    let data = res.data;
    for (var i in data) {
        var objectInstance = data[i].data;

        for (var j in objectInstance.value.children) {
            var vault = objectInstance.value.children[j].value;
            const RedisKey = vault;
            client.get(RedisKey, (err, address) => {

                if (address) {
                    console.log('exists in cache');
                }
                else {
                    tezos.tz
                        .getBalance(RedisKey)
                        .then((balance) => {
                            console.log(`${balance.toNumber() / 1000000} ꜩ`);
                            //client.set(RedisKey, JSON.stringify(balance))
                            client.set(RedisKey, balance.toNumber());
                        })
                }
            })

        }
    }
}

app.get('/fetchindexdata', (req, res) => {
    fetchfrombchain();
    res.send('USER DETAILS');
});
app.get('/getinfo', (req, res) => {
    let address = 'KT1BfUUUPFmGJsMLMAjo2AfJ7UbcmqDqEF2k';
    console.log('user details');

    client.get(address, (err, value) => {

        if (value) {
            console.log('exists in cache');
            res.send(value);
        }
        else {
            tezos.tz
                .getBalance(address)
                .then((balance) => {
                    console.log(`${balance.toNumber() / 1000000} ꜩ`);
                    //client.set(RedisKey, JSON.stringify(balance))
                    client.set(address, balance.toNumber());

                })
        }
    })
});
app.listen(port, () => {
    console.log("Node server started");
});