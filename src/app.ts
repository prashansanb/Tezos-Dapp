
import express from 'express';
//import { TezosToolkit } from '@taquito/taquito';
//import { TezBridgeSigner } from '@taquito/tezbridge-signer';

const axios = require('axios');
const app = express();
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

async function fetchfrombchain() {
    let res = await axios.get('https://better-call.dev/v1/bigmap/delphinet/75796/keys');
    let data = res.data;
    //console.log(data);
    for(var i in data){
        var objectInstance = data[i].data;
        var timest= data[i].timestamp;
        for(var j in objectInstance.value.children) {
            var account = objectInstance.value.children[j].value;
            console.log(account);
        }
        console.log('...');
    }
    
}
app.get('/fetchindexdata', (req, res) => {
    fetchfrombchain();
    res.send('INDEX DATA');
});

app.listen(port, () => {
    console.log("Node server started");
});