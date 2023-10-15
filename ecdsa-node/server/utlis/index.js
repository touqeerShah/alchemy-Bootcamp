const secp = require("ethereum-cryptography/secp256k1");

const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

function getAddress(publicKey) {
  const publicKeyWithoutFormatByte = publicKey.slice(1);
  const hash = keccak256(publicKeyWithoutFormatByte);
  return hash.slice(-20);
}

async function signMessage(msg) {
  let messageHash = hashMessage(msg);
  return secp.secp256k1.sign(messageHash, PRIVATE_KEY, { recovered: true });
}

function hashMessage(message) {
  return keccak256(Uint8Array.from(message));
}

async function generatePrivateKey() {
  // console.log("secp256k1.utils",secp256k1)
  return toHex(secp.secp256k1.utils.randomPrivateKey());
}

async function generatePublicKey(privateKey) {
  return secp.secp256k1.getPublicKey(privateKey);
}

async function recoverKey(message, signature, sender) {
  const isValid =
    secp.secp256k1.verify(signature, hashMessage(message), sender) === true;

  return isValid;
}

async function init() {
  let balances = {};
  for (let index = 0; index < 5; index++) {
    const privateKey = await generatePrivateKey();
    const publicKey = await generatePublicKey(privateKey);
    console.log("privateKey : ", privateKey);
    console.log("publicKey : ", toHex(publicKey));

    const address = toHex(getAddress(publicKey));
    balances[toHex(publicKey)] = 100;
  }
  return balances;
}

module.exports = {
  getAddress,
  hashMessage,
  signMessage,
  generatePrivateKey,
  generatePublicKey,
  recoverKey,
  init,
};
