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
const axios = require('axios');
const app = express_1.default();
const port = 3000;
//const tezos = new TezosToolkit('https://delphinet.smartpy.io');
//tezos.setProvider({ signer: new TezBridgeSigner() });
//tezos.tz.getBalance('edskRs3ouFyhyzrddNyFSy51MzJaqDfQSVtPGzsBC7aSqDcrxWuhEsyG345N9e3eirtSRobnCgBJ5Wj1NoJWxSjJqHp5JmBfQ9').then((balance) => console.log(`${balance.toNumber() / 1000000} ꜩ`)).catch((error) => console.log(JSON.stringify(error)));
// Tezos.tz
//   .getBalance('edskRs3ouFyhyzrddNyFSy51MzJaqDfQSVtPGzsBC7aSqDcrxWuhEsyG345N9e3eirtSRobnCgBJ5Wj1NoJWxSjJqHp5JmBfQ9')
//   .then((balance) => console.log(`${balance.toNumber() / 1000000} ꜩ`))
//   .catch((error) => console.log(JSON.stringify(error)));
app.get('/', (req, res) => {
    res.send('API WORKING');
});
function fetchfrombchain() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield axios.get('https://better-call.dev/v1/bigmap/delphinet/75796/keys');
        let data = res.data;
        //console.log(data);
        for (var i in data) {
            var objectInstance = data[i].data;
            var timest = data[i].timestamp;
            for (var j in objectInstance.value.children) {
                var account = objectInstance.value.children[j].value;
                console.log(account);
            }
            console.log('...');
        }
    });
}
app.get('/fetchindexdata', (req, res) => {
    fetchfrombchain();
    res.send('INDEX DATA');
});
app.listen(port, () => {
    console.log("Node server started");
});
//# sourceMappingURL=app.js.map