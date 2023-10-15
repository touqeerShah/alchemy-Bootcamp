import { useState } from "react";
import server from "./server";
import { signMessage, stringifyBigInts } from "../utlis"
function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      let msg = JSON.stringify({
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      })
      let sign = await signMessage(msg, privateKey)
      const sigStringed = stringifyBigInts(sign);
      console.log("sigStringed", sigStringed)
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sig: sigStringed, msg, sender: address, recipient, amount: parseInt(sendAmount),
        });
        setBalance(balance);

      } catch (erro) {
        console.log("erro", erro)
        alert(erro.message);
      }
    } catch (ex) {
      console.log("ex", ex)
      // alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
