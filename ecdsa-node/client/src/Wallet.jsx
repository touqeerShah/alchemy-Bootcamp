import server from "./server";
import { generatePublicKey, getAddress } from "../utlis"
import { toHex } from "ethereum-cryptography/utils";
import * as secp from 'ethereum-cryptography/secp256k1';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    const publicKey = generatePublicKey(privateKey)
    const address = toHex(publicKey);

    setPrivateKey(privateKey);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }



  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input placeholder="Type an private key, " value={privateKey} onChange={onChange}></input>
      </label>
      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} readOnly ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
