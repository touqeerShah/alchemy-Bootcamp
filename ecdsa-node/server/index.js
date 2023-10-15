const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { init, recoverKey, getAddress } = require("./utlis");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

let balances = {};
async function startInit() {
  balances = await init();
  console.log("balances", balances);
}
startInit();
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, sig: sigStringed, msg, recipient, amount } = req.body;

  console.log("sig", sender);
  const sig = {
    ...sigStringed,
    r: BigInt(sigStringed.r),
    s: BigInt(sigStringed.s),
  };

  const isValid = await recoverKey(msg, sig, sender);
  console.log("isValid", isValid);
  if (!isValid) {
    res.status(400).send({ message: "Bad signature!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    console.log("balances", balances);
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
