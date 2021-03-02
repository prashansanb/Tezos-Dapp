
const express = require("express")
var taquito = require("@taquito/taquito")
const redis = require("redis");
const axios = require('axios');
//const fetch = require("node-fetch");
const app = express();
const port = 3000;


const tezos = new taquito.TezosToolkit('https://delphinet.smartpy.io');

/*
var redisHost = 'API ENDPOINT';
var redisPort = process.argv[3] || 12345;
var redisAuth = ‘thisismypassword’;
var client = redis.createClient({
    port: redisPort,
    host: redisHost
});/

client.auth(redisAuth, function (err, response) {
    if (err) {
        throw err;
    }
});
*/

const redisPort = 6379
const client = redis.createClient(redisPort);
client.on("error", (err) => {
    console.log(err);
})

app.get('/fetchindexdata', async (req, res) => {
    let nums= await axios.get('https://better-call.dev/v1/bigmap/delphinet/75796')
    let activekeys= nums.data.active_keys;
    console.log(activekeys);
    let result = await axios.get('https://better-call.dev/v1/bigmap/delphinet/75796/keys');
    let data = result.data;
    for (var i=0; i<activekeys;i++) {
        var objectInstance = data[i].data;
        var accountowner = objectInstance.key.value;
        for (var j in objectInstance.value.children) {
            var vault = objectInstance.value.children[j].value;
            console.log(vault);
            const contract = await tezos.contract.at(vault);
            var storage = await contract.storage();
            const RedisKey = vault;

            client.hmset(RedisKey,
                'Insurance', Date.parse(storage.Insurance),
                'duration', Date.parse(storage.duration),
                'Liquidated', String(storage.Liquidated),
                'interest', storage.interest.toNumber(),
                'interestRate', storage.interestRate.toNumber(),
                'owner', String(storage.owner),
                'securityDelegator', String(storage.securityDelegator),
                'token', storage.token.toNumber(),
                'xtz', storage.xtz.toNumber()
                , function (err, reply) {
                    console.log(reply);
                }
            );

        }
    }
    res.send('GOT VAULT DETAILS');
});

async function fetchinfo() {
    let address = 'KT1BfUUUPFmGJsMLMAjo2AfJ7UbcmqDqEF2k';
    const contract = await tezos.contract.at(address);
    var storage = await contract.storage();
    client.hgetall(address, (err, value) => {
        if (value) {
            console.log('exists in cache');
            console.log(value);
        }
        else {

            const RedisKey = address;

            client.hmset(RedisKey,
                'Insurance', Date.parse(storage.Insurance),
                'duration', Date.parse(storage.duration),
                'Liquidated', String(storage.Liquidated),
                'interest', storage.interest.toNumber(),
                'interestRate', storage.interestRate.toNumber(),
                'owner', String(storage.owner),
                'securityDelegator', String(storage.securityDelegator),
                'token', storage.token.toNumber(),
                'xtz', storage.xtz.toNumber()
                , function (err, reply) {
                    console.log(reply);
                }
            );
            console.log('stored in cache');
        }
    })
}
app.get('/getinfo', (req, res) => {
    console.log('user details');
    fetchinfo();
    res.send('got it')
});
app.listen(port, () => {
    console.log("Node server started");
});