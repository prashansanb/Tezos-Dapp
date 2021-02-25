"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taquito_1 = require("@taquito/taquito");
const app = express_1.default();
const port = 3000;
const Tezos = new taquito_1.TezosToolkit('https://delphinet.smartpy.io');
Tezos.tz
    .getBalance('tz1Zq86VbqKKjgjNeaKUXfBTmgMfPjWgeTnK')
    .then((balance) => console.log(`${balance.toNumber() / 1000000} ꜩ`))
    .catch((error) => console.log(JSON.stringify(error)));
app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});
app.listen(port, () => {
    console.log("Node server started");
});
//# sourceMappingURL=app.js.map