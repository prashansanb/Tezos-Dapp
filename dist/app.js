var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
var taquito = require("@taquito/taquito");
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
const redisPort = 6379;
const client = redis.createClient(redisPort);
client.on("error", (err) => {
    console.log(err);
});
function fetchfrombchain() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('fetchfrombchain indexer called');
        let res = yield axios.get('https://better-call.dev/v1/bigmap/delphinet/75796/keys');
        let data = res.data;
        for (var i in data) {
            var objectInstance = data[i].data;
            var accountowner = objectInstance.key.value;
            for (var j in objectInstance.value.children) {
                var vault = objectInstance.value.children[j].value;
                console.log(vault);
                const contract = yield tezos.contract.at(vault);
                var storage = yield contract.storage();
                const RedisKey = vault;
                try {
                }
                catch (error) {
                }
                client.setex(RedisKey, 3600, JSON.stringify({
                    Insurance: Date.parse(storage.Insurance),
                    duration: Date.parse(storage.duration),
                    Liquidated: String(storage.Liquidated),
                    interest: storage.interest.toNumber(),
                    interestRate: storage.interestRate.toNumber(),
                    owner: String(storage.owner),
                    securityDelegator: String(storage.securityDelegator),
                    token: storage.token.toNumber(),
                    xtz: storage.xtz.toNumber()
                }, () => {
                    //write error
                }));
            }
        }
        return res.status(200);
    });
}
app.get('/fetchindexdata', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let result = yield axios.get('https://better-call.dev/v1/bigmap/delphinet/75796/keys');
    let data = result.data;
    for (var i in data) {
        var objectInstance = data[i].data;
        var accountowner = objectInstance.key.value;
        for (var j in objectInstance.value.children) {
            var vault = objectInstance.value.children[j].value;
            console.log(vault);
            const contract = yield tezos.contract.at(vault);
            var storage = yield contract.storage();
            const RedisKey = vault;
            client.hmset(RedisKey, 'Insurance', Date.parse(storage.Insurance), 'duration', Date.parse(storage.duration), 'Liquidated', String(storage.Liquidated), 'interest', storage.interest.toNumber(), 'interestRate', storage.interestRate.toNumber(), 'owner', String(storage.owner), 'securityDelegator', String(storage.securityDelegator), 'token', storage.token.toNumber(), 'xtz', storage.xtz.toNumber(), function (err, reply) {
                console.log(reply);
            });
        }
    }
    res.send('GOT VAULT DETAILS');
}));
function fetchinfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let address = 'KT1BfUUUPFmGJsMLMAjo2AfJ7UbcmqDqEF2k';
        const contract = yield tezos.contract.at(address);
        var storage = yield contract.storage();
        try {
            client.hgetall(address, (err, value) => {
                if (value) {
                    console.log('exists in cache');
                    console.log(value);
                }
                else {
                    //STRINGIFY
                    const RedisKey = address;
                    client.hset(RedisKey, JSON.stringify({
                        'Insurance': Date.parse(storage.Insurance),
                        'duration': Date.parse(storage.duration),
                        'Liquidated': String(storage.Liquidated),
                        'interest': storage.interest.toNumber(),
                        'interestRate': storage.interestRate.toNumber(),
                        'owner': String(storage.owner),
                        'securityDelegator': String(storage.securityDelegator),
                        'token': storage.token.toNumber(),
                        'xtz': storage.xtz.toNumber()
                    }, () => {
                        //catch error
                    }));
                    console.log('stored in cache');
                }
            });
            console.log(JSON.parse(yield client.get(address)));
        }
        catch (error) {
            console.error(error);
        }
    });
}
app.get('/getinfo', (req, res) => {
    console.log('user details');
    fetchinfo();
    res.send('got it');
});
app.listen(port, () => {
    console.log("Node server started");
});
//# sourceMappingURL=app.js.map