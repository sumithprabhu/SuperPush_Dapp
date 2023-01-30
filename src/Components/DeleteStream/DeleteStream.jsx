import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import {
  Button,
  Form,
  FormGroup,
  FormControl,
  Spinner,
  Card
} from "react-bootstrap";
import "./DeleteStream.css";
import { ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";

const sendNotification = async(titlein, bodyin,recipientin) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();
    try {
      const recipient = `eip155:5:${recipientin}`
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: titlein,
          body: bodyin
        },
        payload: {
          title: titlein,
          body: bodyin,
          cta: '',
          img: ''
        },
        recipients: recipient, // recipient address
        channel: 'eip155:5:0x49403ae592C82fc3f861cD0b9738f7524Fb1F38C', // your channel address
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  }
//where the Superfluid logic takes place
async function deleteExistingFlow(recipient,setIsCreated,setRecipient) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
  });

  const superSigner = sf.createSigner({ signer: signer });

  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");

  console.log(daix);

  try {
    const send=await superSigner.getAddress();
    const deleteFlowOperation = daix.deleteFlow({
      sender: send,
      receiver: recipient
      // userData?: string
    });

    console.log(deleteFlowOperation);
    console.log("Deleting your stream...");

    const result = await deleteFlowOperation.exec(superSigner);
    console.log(result);

    console.log(
      `Congrats - you've just updated a money stream!
    `
    );
    sendNotification("Stream Deleted",`Stream deleted by ${send}`,recipient);
    setIsCreated(true);
    setRecipient("");
    
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

const DeleteStream = ({checkIfWalletIsConnected,currentAccount}) => {
  const [recipient, setRecipient] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);


  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  function DeleteButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? "Deleting...": children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  return (
    <div className="DS" id="delete">
      <h2 className="title">Delete a Flow</h2>
      
      <Form className="Form">
        <FormGroup className="mb-3">
          <FormControl
          className="textbox"
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter recipient address"
          ></FormControl>
        </FormGroup>
        <FormGroup className="mb-3"></FormGroup>
        <DeleteButton
          onClick={() => {
            setIsButtonLoading(true);
            deleteExistingFlow(recipient,setIsCreated,setRecipient);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 10000);
            setTimeout(() => {
              setIsCreated(false);
            }, 20000);
          }}
        >
          Click to Delete Your Stream
        </DeleteButton>
        <h1 className="deleted">{isCreated ? "Stream Deleted" : ""}</h1>
      </Form>

      
    </div>
  );
};

export default DeleteStream;
