
import express from 'express';
import { TezosToolkit } from '@taquito/taquito';


const app = express();
const port = 3000;

const Tezos = new TezosToolkit('https://delphinet.smartpy.io');
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