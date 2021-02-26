"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var taquito = require("@taquito/taquito");
const redis = require("redis");
const axios = require('axios');
const fetch = require("node-fetch");
const app = express_1.default();
const port = 3000;
const tezos = new taquito.TezosToolkit('https://delphinet.smartpy.io');
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
            for (var j in objectInstance.value.children) {
                var vault = objectInstance.value.children[j].value;
                const RedisKey = vault;
                client.get(RedisKey, (err, address) => {
                    if (address) {
                        console.log('exists in cache');
                        res.send(address);
                    }
                    else {
                        tezos.tz
                            .getBalance(RedisKey)
                            .then((balance) => {
                            console.log(`${balance.toNumber() / 1000000} ꜩ`);
                            //client.set(RedisKey, JSON.stringify(balance))
                            client.set(RedisKey, balance.toNumber());
                            res.send(balance.toNumber());
                        });
                    }
                });
            }
        }
    });
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
            });
        }
    });
});
app.listen(port, () => {
    console.log("Node server started");
});
//# sourceMappingURL=app.js.map