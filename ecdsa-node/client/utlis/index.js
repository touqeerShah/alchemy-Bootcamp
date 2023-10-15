import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
export function getAddress(publicKey) {
  const publicKeyWithoutFormatByte = publicKey.slice(1);
  const hash = keccak256(publicKeyWithoutFormatByte);
  return hash.slice(-20);
}

export async function signMessage(msg, privateKey) {
  let messageHash = hashMessage(msg);
  return secp.secp256k1.sign(messageHash, privateKey);
}

function hashMessage(message) {
  // hash the message using keccak256
  return keccak256(Uint8Array.from(message));
}

export function generatePublicKey(privateKey) {
  console.log("privateKey", privateKey);

  return secp.secp256k1.getPublicKey(privateKey);
}

export async function recoverKey(message, signature, recoveryBit) {
  return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit);
}

export const stringifyBigInts = (obj) => {
  for (let prop in obj) {
    let value = obj[prop];
    if (typeof value === "bigint") {
      obj[prop] = value.toString();
    } else if (typeof value === "object" && value !== null) {
      obj[prop] = stringifyBigInts(value);
    }
  }
  return obj;
};

// module.exports = {getAddress,hashMessage,signMessage,generatePrivateKey,generatePublicKey,recoverKey,init};
